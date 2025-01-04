import express from 'express';
import pool from './db.js';
import { verifyToken, checkRole } from './utils/verifyToken.js';
const router = express.Router();

// router.get('/allCases', verifyToken, checkRole(['admin']), async (req, res) => {
//     try {
//         if (req.user.role !== 'admin') {
//             return res.status(403).json({ message: 'Access denied. Only admins can access this resource.' });
//         }

//         const cases = await pool.query('SELECT * FROM cases');
//         res.json(cases.rows);
//     } catch (err) {
//         console.error('Error fetching all cases:', err.message);
//         res.status(500).send('Server error');   
//     }
// });


router.get('/allCases', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        // Pagination settings
        const page = parseInt(req.query.page) || 1; // Default page 1
        const limit = parseInt(req.query.limit) || 10; // Default limit 10
        const offset = (page - 1) * limit;

        // Query to fetch paginated cases
        const cases = await pool.query(
            'SELECT * FROM cases ORDER BY date DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        // Count total records
        const totalCountResult = await pool.query('SELECT COUNT(*) FROM cases');
        const totalCount = totalCountResult.rows[0].count;

        // Return paginated data and total count
        res.json({
            data: cases.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount: totalCount
            }
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});


export default router;
