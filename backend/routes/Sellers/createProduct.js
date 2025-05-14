import express from "express";
import upload from "../../db/multer.js";
import { sql, poolPromise } from "../../db/sql.js";

const router = express.Router();

router.post("/", upload.array("images", 10), async (req, res) => {
  const {
    user_id,
    name,
    description,
    price,
    quantity,
    category,
    is_rentable,
    is_biddable,
    status,
    is_sellable,
    rent,
    daily_late_fee,
    damage_fee
  } = req.body;

  const images = req.files;

  // Parse is_sellable and is_rentable as booleans
  const sellable = (is_sellable === true || is_sellable === 'true' || is_sellable === 1 || is_sellable === '1');
  const rentable = (is_rentable === true || is_rentable === 'true' || is_rentable === 1 || is_rentable === '1');

  // Parse price and rent as numbers, fallback to 0
  const parsedPrice = parseFloat(price) || 0;
  const parsedRent = parseFloat(rent) || 0;

  if (!user_id || !name || !quantity) {
    return res.status(400).json({ message: "Required fields missing." });
  }
  if (!sellable && !rentable) {
    return res.status(400).json({ message: "Product must be either sellable, rentable, or both." });
  }
  if (sellable && !parsedPrice) {
    return res.status(400).json({ message: "Price is required for sellable products." });
  }
  if (rentable && !parsedRent) {
    return res.status(400).json({ message: "Rent is required for rentable products." });
  }

  try {
    const pool = await poolPromise;

    // Check if seller exists
    const sellerQuery = await pool.request()
      .input("user_id", sql.Int, user_id)
      .query("SELECT seller_id FROM Sellers WHERE user_id = @user_id");

    if (sellerQuery.recordset.length === 0)
      return res.status(400).json({ message: "Store does not exist for this user." });

    const seller_id = sellerQuery.recordset[0].seller_id;

    // Debug log trimmed category
    let category_id = null;
    if (category) {
      const trimmedCategory = category.trim();
      console.log("[DEBUG] Category input from frontend:", trimmedCategory);

      // Only use category_name for lookup
      const categoryResult = await pool.request()
        .input("category_name", sql.NVarChar, trimmedCategory)
        .query("SELECT category_id, category_name FROM Categories WHERE LOWER(category_name) = LOWER(@category_name)");
      console.log("[DEBUG] Category query result:", categoryResult.recordset);

      if (categoryResult.recordset.length === 1) {
        category_id = categoryResult.recordset[0].category_id;
      } else if (categoryResult.recordset.length === 0) {
        return res.status(400).json({ message: `Category not found. Please use an existing category_name as shown in your Categories table. Received: '${trimmedCategory}'` });
      } else {
        return res.status(400).json({ message: `Multiple categories found with the name '${trimmedCategory}'. Please ensure category names are unique.` });
      }
    } else {
      return res.status(400).json({ message: "Category is required." });
    }

    // Insert product
    const productResult = await pool.request()
      .input("seller_id", sql.Int, seller_id)
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || null)
      .input("price", sql.Decimal(10, 2), parsedPrice)
      .input("category_id", sql.Int, category_id)
      .input("quantity", sql.Int, quantity)
      .input("is_rentable", sql.Bit, rentable ? 1 : 0)
      .input("is_biddable", sql.Bit, is_biddable || 0)
      .input("status", sql.NVarChar, status || 'active')
      .input("is_sellable", sql.Bit, sellable ? 1 : 0)
      .input("rent", sql.Decimal(10, 2), parsedRent)
      .query(`
        INSERT INTO Products (seller_id, name, description, price, category_id, quantity, is_rentable, is_biddable, status, is_sellable, rent, created_at)
        OUTPUT INSERTED.product_id
        VALUES (@seller_id, @name, @description, @price, @category_id, @quantity, @is_rentable, @is_biddable, @status, @is_sellable, @rent, GETDATE())
      `);

    const product_id = productResult.recordset[0].product_id;

    // Save return policy if rentable
    if (is_rentable && daily_late_fee && damage_fee) {
      await pool.request()
        .input("product_id", sql.Int, product_id)
        .input("daily_late_fee", sql.Decimal(10, 2), daily_late_fee)
        .input("damage_fee", sql.Decimal(10, 2), damage_fee)
        .query(`
          INSERT INTO ReturnPolicies (product_id, daily_late_fee, damage_fee, created_at)
          VALUES (@product_id, @daily_late_fee, @damage_fee, GETDATE())
        `);
    }

    // Upload images
    for (const file of images) {
      const cloudinaryURL = file.path;

      await pool.request()
        .input("product_id", sql.Int, product_id)
        .input("image_url", sql.VarChar, cloudinaryURL)
        .query(`
          INSERT INTO ProductImages (product_id, image_url)
          VALUES (@product_id, @image_url)
        `);
    }

    res.status(201).json({ message: "Product created successfully!", product_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product.", error: err.message });
  }
});

export default router;
