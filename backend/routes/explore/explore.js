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
                SELECT TOP 7 P.category_id, C.category_name, C.symbol
                FROM Preferences P
                JOIN Categories C ON P.category_id = C.category_id
                WHERE P.user_id = @user_id
                ORDER BY P.added_at DESC
            `);

        const preferences = preferenceResult.recordset;
        const finalResponse = [];

        // Query wishlist product IDs for the user
        const wishlistResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`
                SELECT product_id FROM Wishlist WHERE user_id = @user_id
            `);
        const wishlistProductIds = new Set(wishlistResult.recordset.map(r => r.product_id));

        for (const pref of preferences) {
            const { category_id, category_name, symbol } = pref;

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
                SELECT TOP 15 p.product_id, p.name, MAX(CAST(p.description AS NVARCHAR(MAX))) AS description, p.price, p.is_rentable, p.created_at, p.seller_id, pi.image_url, ISNULL(AVG(r.rating), 0) AS average_rating
                FROM Products p
                LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
                LEFT JOIN Reviews r ON p.product_id = r.product_id
                WHERE p.category_id = @category_id
                    AND p.product_id NOT IN (
                        SELECT oi.product_id FROM Orders o JOIN Order_Items oi ON o.order_id = oi.order_id WHERE o.buyer_id = @user_id
                        UNION
                        SELECT r.product_id FROM Rentals r WHERE r.renter_id = @user_id
                    )
                    AND (${pastNames.map((_, i) => `p.name LIKE @pattern${i}`).join(' OR ')})
                GROUP BY p.product_id, p.name, p.price, p.is_rentable, p.created_at, pi.image_url, p.seller_id
                ORDER BY p.created_at DESC
            `;

            const rentalQuery = `
                SELECT TOP 15 p.product_id, p.name, MAX(CAST(p.description AS NVARCHAR(MAX))) AS description, p.price, p.is_rentable, p.created_at, p.seller_id, pi.image_url, ISNULL(AVG(r.rating), 0) AS average_rating
                FROM Products p
                LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
                LEFT JOIN Reviews r ON p.product_id = r.product_id
                WHERE p.category_id = @category_id
                    AND p.is_rentable = 1
                    AND p.product_id NOT IN (
                        SELECT r.product_id FROM Rentals r WHERE r.renter_id = @user_id
                        UNION
                        SELECT oi.product_id FROM Orders o JOIN Order_Items oi ON o.order_id = oi.order_id WHERE o.buyer_id = @user_id
                    )
                    AND (${pastNames.map((_, i) => `p.name LIKE @pattern_rent${i}`).join(' OR ')})
                GROUP BY p.product_id, p.name, p.price, p.is_rentable, p.created_at, pi.image_url, p.seller_id
                ORDER BY p.created_at DESC
            `;

            const [productResult, rentalResult] = await Promise.all([
                requestProduct.query(productQuery),
                requestRental.query(rentalQuery),
            ]);

            // Add is_on_wishlist field to products and rentals
            const productSuggestions = productResult.recordset.map(product => ({
                ...product,
                is_on_wishlist: wishlistProductIds.has(product.product_id),
            }));

            const rentalSuggestions = rentalResult.recordset.map(rental => ({
                ...rental,
                is_on_wishlist: wishlistProductIds.has(rental.product_id),
            }));

            finalResponse.push({
                category_id,
                category_name,
                symbol,
                product_suggestions: productSuggestions,
                rental_suggestions: rentalSuggestions,
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
