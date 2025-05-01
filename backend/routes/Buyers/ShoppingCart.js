import express from 'express';
import { sql, poolPromise } from '../../db/sql.js';
import { addPreference } from './Preferences.js'; // Add this import
import { addPayment } from './Payments.js';  // Import the add payment function

const router = express.Router();

/**
 * Add an item to the shopping cart
 * POST /api/shopping-cart/add-to-cart
 */
router.post("/add-to-cart", async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    // Validate input
    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const pool = await poolPromise;

        // Check if the product exists in the Products table
        const productResult = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM Products WHERE product_id = @product_id');

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Check if the item already exists in the cart
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .query(`
                SELECT * FROM ShoppingCart 
                WHERE user_id = @user_id AND product_id = @product_id
            `);

        if (result.recordset.length > 0) {
            // If item exists, update the quantity
            await pool.request()
                .input('user_id', sql.Int, user_id)
                .input('product_id', sql.Int, product_id)
                .input('quantity', sql.Int, quantity)
                .query(`
                    UPDATE ShoppingCart
                    SET quantity = quantity + @quantity
                    WHERE user_id = @user_id AND product_id = @product_id
                `);
            return res.status(200).json({ message: "Item quantity updated successfully." });
        } else {
            // If item doesn't exist, insert a new record
            await pool.request()
                .input('user_id', sql.Int, user_id)
                .input('product_id', sql.Int, product_id)
                .input('quantity', sql.Int, quantity)
                .query(`
                    INSERT INTO ShoppingCart (user_id, product_id, quantity)
                    VALUES (@user_id, @product_id, @quantity)
                `);
            return res.status(201).json({ message: "Item added to cart successfully." });
        }
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});



router.post("/create-from-cart", async (req, res) => {
    const { buyer_id, payment_method } = req.body;

    // Validate input
    if (!buyer_id || !payment_method) {
        return res.status(400).json({ message: 'Buyer ID and payment method are required.' });
    }

    try {
        const pool = await poolPromise;

        // Step 1: Get the current user's cart data
        const cartResult = await pool.request()
            .input('user_id', sql.Int, buyer_id)
            .query('SELECT * FROM ShoppingCart WHERE user_id = @user_id');

        if (cartResult.recordset.length === 0) {
            return res.status(404).json({ message: "Cart is empty." });
        }

        // Calculate total price
        let total_price = 0;
        const products = [];
        for (let item of cartResult.recordset) {
            const productResult = await pool.request()
                .input('product_id', sql.Int, item.product_id)
                .query('SELECT product_id, price FROM Products WHERE product_id = @product_id');

            if (productResult.recordset.length === 0) {
                return res.status(404).json({ message: `Product with ID ${item.product_id} not found.` });
            }

            const price = productResult.recordset[0].price;
            total_price += price * item.quantity; // Calculate total price
            products.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: price
            });
        }

        // Step 2: Insert the order into the Orders table
        const orderResult = await pool.request()
            .input('buyer_id', sql.Int, buyer_id)
            .input('total_price', sql.Decimal(10, 2), total_price)
            .input('status', sql.VarChar(20), 'pending')
            .query('INSERT INTO Orders (buyer_id, total_price, status) OUTPUT INSERTED.order_id VALUES (@buyer_id, @total_price, @status)');

        const order_id = orderResult.recordset[0].order_id;

        // Step 3: Insert products into the Order_Items table and update buyer preferences
        for (let product of products) {
            await pool.request()
                .input('order_id', sql.Int, order_id)
                .input('product_id', sql.Int, product.product_id)
                .input('quantity', sql.Int, product.quantity)
                .input('price', sql.Decimal(10, 2), product.price)
                .query('INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (@order_id, @product_id, @quantity, @price)');

            // Get the category of the product and update preferences
            const categoryResult = await pool.request()
                .input('product_id', sql.Int, product.product_id)
                .query('SELECT category_id FROM Products WHERE product_id = @product_id');

            if (categoryResult.recordset.length > 0) {
                const category_id = categoryResult.recordset[0].category_id;
                // Update preferences for the buyer
                await addPreference(buyer_id, category_id); // Assuming you have a function to update preferences
            }
        }

        // Step 4: Trigger the payment route
        await addPayment(order_id, buyer_id, total_price, payment_method);

        // Step 5: Clear the user's cart after order creation
        await pool.request()
            .input('user_id', sql.Int, buyer_id)
            .query('DELETE FROM ShoppingCart WHERE user_id = @user_id');

        res.status(201).json({ message: 'Order created successfully!', order_id });

    } catch (err) {
        console.error("Error creating order from cart:", err);
        res.status(500).json({ message: 'Failed to create order.', error: err.message });
    }
});



/**
 * Edit quantity of an item in the cart, or add it if not found
 * PUT /api/shopping-cart/edit-cart
 */
router.put('/edit-cart', async (req, res) => {
    const { cart_id, product_id, new_quantity } = req.body;

    // Validate input
    if (!cart_id || !product_id || !new_quantity) {
        return res.status(400).json({ message: "Cart ID, Product ID, and new quantity are required." });
    }

    if (new_quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than zero." });
    }

    try {
        const pool = await poolPromise;

        // Check if the item exists in the cart
        const cartItem = await pool.request()
            .input('cart_id', sql.Int, cart_id)
            .input('product_id', sql.Int, product_id)
            .query(`
                SELECT * FROM ShoppingCart
                WHERE cart_id = @cart_id AND product_id = @product_id
            `);

        if (cartItem.recordset.length === 0) {
            // Item not found, create a new entry in the cart
            await pool.request()
                .input('cart_id', sql.Int, cart_id)
                .input('product_id', sql.Int, product_id)
                .input('new_quantity', sql.Int, new_quantity)
                .query(`
                    INSERT INTO ShoppingCart (cart_id, product_id, quantity)
                    VALUES (@cart_id, @product_id, @new_quantity)
                `);

            return res.status(201).json({ message: "Item added to the cart successfully." });
        } else {
            // Item found, update the quantity
            await pool.request()
                .input('cart_id', sql.Int, cart_id)
                .input('product_id', sql.Int, product_id)
                .input('new_quantity', sql.Int, new_quantity)
                .query(`
                    UPDATE ShoppingCart
                    SET quantity = @new_quantity
                    WHERE cart_id = @cart_id AND product_id = @product_id
                `);

            return res.status(200).json({ message: "Cart item quantity updated successfully." });
        }
    } catch (err) {
        console.error("Error updating or adding cart item:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


/**
 * Get all cart entries for a user, with product details and associated images
 * GET /api/shopping-cart/:user_id
 */

router.get('/get-cart/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT sc.cart_id, sc.quantity, p.product_id, p.name, p.price, pi.image_url
        FROM ShoppingCart sc
        JOIN Products p ON sc.product_id = p.product_id
        LEFT JOIN ProductImages pi ON p.product_id = pi.product_id
        WHERE sc.user_id = @userId
      `);

    const rows = result.recordset;

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    const cartMap = rows.reduce((acc, item) => {
      const { cart_id, quantity, product_id, name, price, image_url } = item;
      if (!acc[product_id]) {
        acc[product_id] = {
          cart_id,
          product_id,
          name,
          price,
          quantity,
          images: image_url ? [image_url] : [],
        };
      } else if (image_url && !acc[product_id].images.includes(image_url)) {
        acc[product_id].images.push(image_url);
      }
      return acc;
    }, {});

    res.json(Object.values(cartMap));
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
