import express from 'express';
import pool from './db.js';
import { verifyToken, checkRole } from './utils/verifyToken.js';
const router = express.Router();

router.get('/allCases', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
      
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;

        
        const cases = await pool.query(
            'SELECT * FROM cases ORDER BY date DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        
        const totalCountResult = await pool.query('SELECT COUNT(*) FROM cases');
        const totalCount = totalCountResult.rows[0].count;

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
