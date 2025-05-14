import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';  // Assuming you have a poolPromise setup for db connection
import { addPayment } from './Payments.js';  // Import the add payment function
import { addPreference } from './Preferences.js'; // Add this import
import authenticateJWT from '../../middleware/auth.js';

const router = express.Router();

// Route to create an order
router.post("/create-order", authenticateJWT, async (req, res) => {
  const { products, total_price, payment_method } = req.body;
  const buyer_id = req.user; // Extract buyer_id from authenticated user

  // Validate input
  if (!buyer_id || !Array.isArray(products) || products.length === 0 || !total_price || !payment_method) {
    return res.status(400).json({ message: 'Buyer ID, products, total price, and payment method are required.' });
  }

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    console.log("Creating order...");
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Step 1: Insert order into the Orders table
    const result = await request
      .input('buyer_id', sql.Int, buyer_id)
      .input('total_price', sql.Decimal(10, 2), total_price)
      .input('status', sql.VarChar(20), 'pending')
      .query('INSERT INTO Orders (buyer_id, total_price, status) OUTPUT INSERTED.order_id VALUES (@buyer_id, @total_price, @status)');

    const order_id = result.recordset[0].order_id;

    // Step 2: Insert products into the Order_Items table and process preferences
    for (let product of products) {
      const productRequest = new sql.Request(transaction);
      await productRequest
        .input('order_id', sql.Int, order_id)
        .input('product_id', sql.Int, product.product_id)
        .input('quantity', sql.Int, product.quantity)
        .input('price', sql.Decimal(10, 2), product.price)
        .query('INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)');

      // Get the category of the product
      const categoryRequest = new sql.Request(transaction);
      const categoryResult = await categoryRequest
        .input('product_id', sql.Int, product.product_id)
        .query('SELECT category_id FROM Products WHERE product_id = @product_id');

      if (categoryResult.recordset.length > 0) {
        const category_id = categoryResult.recordset[0].category_id;
        // Update preferences for the buyer
        await addPreference(buyer_id, category_id); // Calling your Preferences function
      }
    }

    // Step 3: Insert shipping address into OrderAddresses table
    const { address, city, postal_code, country } = req.body;
    await request
      .input('order_id', sql.Int, order_id)
      .input('address', sql.VarChar(255), address)
      .input('city', sql.VarChar(100), city)
      .input('zip_code', sql.VarChar(20), postal_code)
      .input('country', sql.VarChar(100), country)
      .query(`
        INSERT INTO OrderAddresses (order_id, address, city, zip_code, country)
        VALUES (@order_id, @address, @city, @zip_code, @country)
      `);

    // Step 4: Remove ordered items from ShoppingCart
    const productIds = products.map(p => p.product_id);
    if (productIds.length > 0) {
      const deleteRequest = new sql.Request(transaction);
      deleteRequest.input('user_id', sql.Int, buyer_id);
      productIds.forEach((id, i) => {
        deleteRequest.input('p' + i, sql.Int, id);
      });
      const paramPlaceholders = productIds.map((_, i) => '@p' + i).join(',');
      await deleteRequest.query(`
        DELETE FROM ShoppingCart
        WHERE user_id = @user_id AND product_id IN (${paramPlaceholders})
      `);
    }

    // Step 4: Trigger the payment route (you can adjust this based on your payment system)
    await addPayment(order_id, buyer_id, total_price, payment_method, transaction);

    await transaction.commit();
    console.log(`Order created successfully with ID: ${order_id}`);
    res.status(201).json({ message: 'Order created successfully!', order_id });
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to create order.', error: err.message });
  }
});

// Route to get current user's orders list
router.get("/my-orders", authenticateJWT, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user; // Assuming req.user is set by authentication middleware

        const result = await pool.request()
            .input('buyer_id', sql.Int, userId)
            .query('SELECT order_id, order_date, total_price FROM Orders WHERE buyer_id = @buyer_id ORDER BY order_date DESC');

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve orders.', error: err.message });
    }
});

// Route to get order details by order ID with product name and image
router.get("/get-order/:order_id", authenticateJWT, async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        // Step 1: Get the order details
        const orderResult = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('SELECT * FROM Orders WHERE order_id = @order_id');

        if (orderResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const order = orderResult.recordset[0];

        // Step 2: Get the items in the order with product name and image
        const itemsResult = await pool.request()
            .input('order_id', sql.Int, order_id)
            .query(`
        SELECT oi.*, p.name, pi.image_url
        FROM Order_Items oi
        JOIN Products p ON oi.product_id = p.product_id
        LEFT JOIN productImages pi ON oi.product_id = pi.product_id
        WHERE oi.order_id = @order_id
            `);

        const orderItems = itemsResult.recordset;

        // Return the order with its items
        res.json({ order, items: orderItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve order.', error: err.message });
    }
});

// Route to remove an order by order ID
router.delete("/remove-order/:order_id", authenticateJWT, async (req, res) => {
    const { order_id } = req.params;

    try {
        const pool = await poolPromise;

        // Step 1: Delete items from Order_Items table
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('DELETE FROM Order_Items WHERE order_id = @order_id');

        // Step 2: Delete the order from Orders table
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .query('DELETE FROM Orders WHERE order_id = @order_id');

        res.status(200).json({ message: 'Order and its items removed successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove order.', error: err.message });
    }
});


router.put('/update-order/:order_id', authenticateJWT, async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;  // Status is expected to be passed in the request body (e.g., 'delivered')

    if (!status) {
        return res.status(400).json({ message: 'Missing order status.' });
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Update the order status in the Orders table
        const result = await request
            .input('order_id', sql.Int, order_id)
            .input('status', sql.VarChar, status)
            .query(`
                UPDATE Orders
                SET status = @status
                WHERE order_id = @order_id
            `);

        // If the order was updated
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: `Order status updated to \${status}.` });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status.', error: error.message });
    }
});

export default router;

