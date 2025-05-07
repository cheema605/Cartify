import express from 'express';
import { poolPromise, sql } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
    const user_id = req.user;
    
    try {

        
        const pool = await poolPromise;
        console.log("user authenticated", user_id);

        const preferenceResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`
                SELECT TOP 7 P.category_id, C.category_name
                FROM Preferences P
                JOIN Categories C ON P.category_id = C.category_id
                WHERE P.user_id = @user_id
                ORDER BY P.added_at DESC
            `);

        const preferences = preferenceResult.recordset;
        const finalResponse = [];

        for (const pref of preferences) {
            const { category_id, category_name } = pref;

            // Get previously used product names
            const nameResult = await pool.request()
                .input('user_id', sql.Int, user_id)
                .input('category_id', sql.Int, category_id)
                .query(`
                    SELECT DISTINCT p.name
                    FROM Products p
                    WHERE p.product_id IN (
                        SELECT oi.product_id
                        FROM Orders o
                        JOIN Order_Items oi ON o.order_id = oi.order_id
                        JOIN Products p2 ON oi.product_id = p2.product_id
                        WHERE o.buyer_id = @user_id AND p2.category_id = @category_id

                        UNION

                        SELECT r.product_id
                        FROM Rentals r
                        JOIN Products p3 ON r.product_id = p3.product_id
                        WHERE r.renter_id = @user_id AND p3.category_id = @category_id
                    )
                `);

            const pastNames = nameResult.recordset.map(r => r.name);
            if (pastNames.length === 0) continue;

            // Prepare inputs for LIKE queries
            const requestProduct = pool.request()
                .input('user_id', sql.Int, user_id)
                .input('category_id', sql.Int, category_id);

            const requestRental = pool.request()
                .input('user_id', sql.Int, user_id)
                .input('category_id', sql.Int, category_id);

            pastNames.forEach((name, i) => {
                requestProduct.input(`pattern${i}`, sql.NVarChar, `%${name}%`);
                requestRental.input(`pattern_rent${i}`, sql.NVarChar, `%${name}%`);
            });

            const productQuery = `
                SELECT TOP 15 p.*, pi.image_url
                FROM Products p
                LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
                WHERE p.category_id = @category_id
                    AND p.product_id NOT IN (
                        SELECT oi.product_id FROM Orders o JOIN Order_Items oi ON o.order_id = oi.order_id WHERE o.buyer_id = @user_id
                        UNION
                        SELECT r.product_id FROM Rentals r WHERE r.renter_id = @user_id
                    )
                    AND (${pastNames.map((_, i) => `p.name LIKE @pattern${i}`).join(' OR ')})
                ORDER BY p.created_at DESC
            `;

            const rentalQuery = `
                SELECT TOP 15 p.*, pi.image_url
                FROM Products p
                LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
                WHERE p.category_id = @category_id
                    AND p.is_rentable = 1
                    AND p.product_id NOT IN (
                        SELECT r.product_id FROM Rentals r WHERE r.renter_id = @user_id
                        UNION
                        SELECT oi.product_id FROM Orders o JOIN Order_Items oi ON o.order_id = oi.order_id WHERE o.buyer_id = @user_id
                    )
                    AND (${pastNames.map((_, i) => `p.name LIKE @pattern_rent${i}`).join(' OR ')})
                ORDER BY p.created_at DESC
            `;

            const [productResult, rentalResult] = await Promise.all([
                requestProduct.query(productQuery),
                requestRental.query(rentalQuery),
            ]);

            finalResponse.push({
                category_id,
                category_name,
                product_suggestions: productResult.recordset,
                rental_suggestions: rentalResult.recordset,
            });
        }
        console.log("Final response:", finalResponse);
        res.json(finalResponse);
    } catch (error) {
        console.error('Error generating explore suggestions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
