import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// GET rental order details by rental_order_id
router.get("/get-rental-order/:rental_order_id", authenticateJWT, async (req, res) => {
    const { rental_order_id } = req.params;

    try {
        const pool = await poolPromise;

        // Query rental order details
        const rentalOrderResult = await pool.request()
            .input('rental_order_id', sql.Int, rental_order_id)
            .query('SELECT * FROM RentalOrders WHERE rental_order_id = @rental_order_id');

        if (rentalOrderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Rental order not found.' });
        }

        const rentalOrder = rentalOrderResult.recordset[0];

        // Query rental order items
        const itemsResult = await pool.request()
            .input('rental_order_id', sql.Int, rental_order_id)
            .query(`
                SELECT roi.*, p.name, pi.image_url
                FROM RentalOrder_Items roi
                JOIN Products p ON roi.product_id = p.product_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM ProductImages
                    GROUP BY product_id
                ) pi ON p.product_id = pi.product_id
                WHERE roi.rental_order_id = @rental_order_id
            `);

        const rentalOrderItems = itemsResult.recordset;

        res.json({ rentalOrder, items: rentalOrderItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rental order.', error: err.message });
    }
});


// POST create rental order
router.post("/create-rental-order", authenticateJWT, async (req, res) => {
    const { product_id, quantity, rent_days, total_rent } = req.body;
    const user_id = req.user;

    if (!product_id || !quantity || !rent_days || !total_rent) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;

        // Insert rental order
        const rentalOrderResult = await pool.request()
            .input("user_id", sql.Int, user_id)
            .input("total_rent", sql.Decimal(10, 2), total_rent)
            .query(`
                INSERT INTO RentalOrders (user_id, total_rent, created_at)
                OUTPUT INSERTED.rental_order_id
                VALUES (@user_id, @total_rent, GETDATE())
            `);

        const rental_order_id = rentalOrderResult.recordset[0].rental_order_id;

        // Insert rental order item
        await pool.request()
            .input("rental_order_id", sql.Int, rental_order_id)
            .input("product_id", sql.Int, product_id)
            .input("quantity", sql.Int, quantity)
            .input("rent_days", sql.Int, rent_days)
            .query(`
                INSERT INTO RentalOrder_Items (rental_order_id, product_id, quantity, rent_days)
                VALUES (@rental_order_id, @product_id, @quantity, @rent_days)
            `);

        res.status(201).json({ message: "Rental order created successfully.", rental_order_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create rental order.", error: err.message });
    }
});

// POST create rental with payment and address
router.post("/create-rental", authenticateJWT, async (req, res) => {
    const { rentalDetails, paymentDetails, addressDetails } = req.body;
    const user_id = req.user;

    if (!rentalDetails || !paymentDetails || !addressDetails) {
        return res.status(400).json({ message: "All details are required." });
    }

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        console.log("rentalDetails", rentalDetails);
        console.log("paymentDetails", paymentDetails);
        console.log("addressDetails", addressDetails);
        // Ensure return date is calculated correctly
        const rentalStartDate = new Date();
        const rentalEndDate = new Date(rentalStartDate.getTime() + rentalDetails.rent_days * 24 * 60 * 60 * 1000);

        // Insert rental with updated schema
        const rentalResult = await transaction.request()
            .input("product_id", sql.Int, rentalDetails.product_id)
            .input("renter_id", sql.Int, user_id)
            .input("rental_start_date", sql.Date, rentalStartDate)
            .input("rental_end_date", sql.Date, rentalEndDate)
            .query(`
                INSERT INTO Rentals (product_id, renter_id, rental_start_date, rental_end_date, status)
                OUTPUT INSERTED.rental_id
                VALUES (@product_id, @renter_id, @rental_start_date, @rental_end_date, 'ongoing')
            `);

        const rental_id = rentalResult.recordset[0].rental_id;

        // Insert payment
        await transaction.request()
            .input("user_id", sql.Int, user_id)
            .input("rental_id", sql.Int, rental_id)
            .input("amount", sql.Decimal(10, 2), paymentDetails.amount)
            .input("payment_method", sql.VarChar(50), paymentDetails.payment_method)
            .query(`
                INSERT INTO rentalPayments (user_id, rental_id, amount, payment_method, payment_date)
                VALUES (@user_id, @rental_id, @amount, @payment_method, GETDATE())
            `);

        // Insert address into the correct columns of rentalAddresses
        await transaction.request()
            .input("rental_id", sql.Int, rental_id)
            .input("address", sql.NVarChar(255), addressDetails.address)
            .input("city", sql.NVarChar(100), addressDetails.city)
            .input("zip_code", sql.NVarChar(20), addressDetails.postalCode)
            .input("country", sql.NVarChar(100), addressDetails.country)
            .query(`
                INSERT INTO rentalAddresses (rental_id, address, city, zip_code, country)
                VALUES (@rental_id, @address, @city, @zip_code, @country)
            `);

        await transaction.commit();

        res.status(201).json({ message: "Rental created successfully." });
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        res.status(500).json({ message: "Failed to create rental.", error: err.message });
    }
});

export default router;
