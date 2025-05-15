import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// Existing routes for RentalOrders (not to be changed)
router.get("/get-rental-order/:rental_order_id", authenticateJWT, async (req, res) => {
    const { rental_order_id } = req.params;

    // Log and validate rental_order_id
    if (!rental_order_id || isNaN(rental_order_id)) {
        console.error("Invalid rental_order_id:", rental_order_id);
        return res.status(400).json({ message: "Invalid rental_order_id." });
    }

    try {
        const pool = await poolPromise;

        // Query rental order details
        const rentalOrderResult = await pool.request()
            .input('rental_order_id', sql.Int, rental_order_id)
            .query('SELECT * FROM Rentals WHERE rental_id = @rental_order_id');

        if (rentalOrderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Rental order not found.' });
        }

        const rentalOrder = rentalOrderResult.recordset[0];

        // Query rental order items
        const itemsResult = await pool.request()
            .input('rental_order_id', sql.Int, rental_order_id)
            .query(`
                SELECT r.*, p.name, p.price, pi.image_url
                FROM Rentals r
                JOIN Products p ON r.product_id = p.product_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM ProductImages
                    GROUP BY product_id
                ) pi ON r.product_id = pi.product_id
                WHERE r.rental_id = @rental_order_id
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
                INSERT INTO Rentals (renter_id, total_rent, rental_start_date)
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
                INSERT INTO Rentals (rental_id, product_id, renter_id, rental_start_date, rental_end_date, status)
                VALUES (@rental_order_id, @product_id, @quantity, GETDATE(), DATEADD(day, @rent_days, GETDATE()), 'ongoing')
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

router.get("/my-rental-orders", authenticateJWT, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user;

        const result = await pool.request()
            .input('buyer_id', sql.Int, userId)
            .query('SELECT rental_id, rental_start_date, rental_end_date, status FROM Rentals WHERE renter_id = @buyer_id ORDER BY rental_start_date DESC');

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rental orders.', error: err.message });
    }
});

// New routes using Rentals table
router.get("/get-rental/:rental_id", authenticateJWT, async (req, res) => {
    const { rental_id } = req.params;

    try {
        const pool = await poolPromise;

        // Query rental details
        const rentalResult = await pool.request()
            .input('rental_id', sql.Int, rental_id)
            .query(`
                SELECT r.*, p.name, pi.image_url
                FROM Rentals r
                JOIN Products p ON r.product_id = p.product_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM ProductImages
                    GROUP BY product_id
                ) pi ON r.product_id = pi.product_id
                WHERE r.rental_id = @rental_id
            `);

        if (rentalResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Rental not found.' });
        }

        const rental = rentalResult.recordset[0];
        res.json({ rental });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rental.', error: err.message });
    }
});

router.get("/my-rentals", authenticateJWT, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user;

        const result = await pool.request()
            .input('renter_id', sql.Int, userId)
            .query(`
                SELECT r.rental_id, r.rental_start_date, r.rental_end_date, r.status, p.name
                FROM Rentals r
                JOIN Products p ON r.product_id = p.product_id
                WHERE r.renter_id = @renter_id
                ORDER BY r.rental_start_date DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve rentals.', error: err.message });
    }
});

export default router;
