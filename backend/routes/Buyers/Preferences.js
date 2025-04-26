import express from 'express';
import { sql, poolPromise } from '../../db/sql.js'; // Assuming you have a poolPromise setup for db connection

const router = express.Router();

// POST /api/preferences/add
// router.post('/add-preferences', async (req, res) => {
//     const { user_id, category_id } = req.body;

//     if (!user_id || !category_id) {
//         return res.status(400).json({ message: 'Missing user_id or category_id.' });
//     }

//     try {
//         const pool = await poolPromise;
//         const transaction = new sql.Transaction(pool);
//         await transaction.begin();

//         const request = new sql.Request(transaction);

//         // Check if preference already exists
//         const existingPref = await request
//             .input('user_id', sql.Int, user_id)
//             .input('category_id', sql.Int, category_id)
//             .query(`
//                 SELECT * FROM Preferences
//                 WHERE user_id = @user_id AND category_id = @category_id
//             `);

//         if (existingPref.recordset.length > 0) {
//             // Update existing preference to latest
//             await request
//                 .query(`
//                     UPDATE Preferences
//                     SET added_at = GETDATE()
//                     WHERE user_id = @user_id AND category_id = @category_id
//                 `);
//         } else {
//             // Check total preferences
//             const countPref = await request
//                 .input('user_id', sql.Int, user_id)
//                 .query(`
//                     SELECT COUNT(*) as count FROM Preferences
//                     WHERE user_id = @user_id
//                 `);

//             const currentCount = countPref.recordset[0].count;

//             // If 15 or more, delete the oldest one
//             if (currentCount >= 15) {
//                 await request
//                     .query(`
//                         DELETE FROM Preferences
//                         WHERE preference_id = (
//                             SELECT TOP 1 preference_id
//                             FROM Preferences
//                             WHERE user_id = @user_id
//                             ORDER BY added_at ASC
//                         )
//                     `);
//             }

//             // Insert new preference
//             await request
//                 .query(`
//                     INSERT INTO Preferences (user_id, category_id, added_at)
//                     VALUES (@user_id, @category_id, GETDATE())
//                 `);
//         }

//         await transaction.commit();
//         res.status(200).json({ message: 'Preference updated successfully.' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update preference.', error: error.message });
//     }
// });

// GET /api/preferences/get
router.get('/get-preferences/:user_id', async (req, res) => {
    const { user_id } = req.params;  // Accessing user_id from URL params

    if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id.' });
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const result = await request
            .input('user_id', sql.Int, user_id)  // Using user_id to bind the query parameter
            .query(`
                SELECT category_id, added_at
                FROM Preferences
                WHERE user_id = @user_id
                ORDER BY added_at DESC
            `);

        res.status(200).json({ preferences: result.recordset });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch preferences.', error: error.message });
    }
});


// Function to add or update preference in Preferences.js
export async function addPreference(buyer_id, category_id) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Check if preference already exists
    const existingPref = await request
        .input('buyer_id_pref', sql.Int, buyer_id)  // Renamed parameter for preference check
        .input('category_id', sql.Int, category_id)
        .query(`
            SELECT * FROM Preferences
            WHERE user_id = @buyer_id_pref AND category_id = @category_id
        `);

    if (existingPref.recordset.length > 0) {
        // Update existing preference to latest
        await request
            .query(`
                UPDATE Preferences
                SET added_at = GETDATE()
                WHERE user_id = @buyer_id_pref AND category_id = @category_id
            `);
    } else {
        // Check total preferences
        const countPref = await request
            .input('buyer_id_count', sql.Int, buyer_id)  // Renamed parameter for counting preferences
            .query(`
                SELECT COUNT(*) as count FROM Preferences
                WHERE user_id = @buyer_id_count
            `);

        const currentCount = countPref.recordset[0].count;

        // If 15 or more, delete the oldest one
        if (currentCount >= 15) {
            await request
                .query(`
                    DELETE FROM Preferences
                    WHERE preference_id = (
                        SELECT TOP 1 preference_id
                        FROM Preferences
                        WHERE user_id = @buyer_id_count
                        ORDER BY added_at ASC
                    )
                `);
        }

        // Insert new preference
        await request
            .query(`
                INSERT INTO Preferences (user_id, category_id, added_at)
                VALUES (@buyer_id_count, @category_id, GETDATE())
            `);
    }

    await transaction.commit();
}


export default router;