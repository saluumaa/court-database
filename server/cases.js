import express from 'express';
import pool from './db.js';
import { verifyToken, checkRole } from './utils/verifyToken.js';
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const cases = await pool.query('SELECT * FROM cases');
        res.json(cases.rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.get('/myCases', verifyToken, checkRole(['districtUser', 'regionalUser', 'admin']), async (req, res) => {
    try {
        let court_type;
        if (req.user.role === 'districtUser') {
            court_type = 'District';
        } else if (req.user.role === 'regionalUser') {
            court_type = 'Regional';
        } else if (req.user.role === 'admin') {
            court_type = 'Appeal'; 
        }
        
        const myCases = await pool.query('SELECT * FROM cases WHERE created_by = $1 AND court_type = $2', [req.user.id, court_type]);
        res.json(myCases.rows);

    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/myCases/:id', verifyToken, checkRole(['districtUser', 'regionalUser', 'admin']), async (req, res) => {
    const { id } = req.params;
    try {
        let court_type;
        if (req.user.role === 'districtUser') {
            court_type = 'District';
        } else if (req.user.role === 'regionalUser') {
            court_type = 'Regional';
        } else if (req.user.role === 'admin') {
            court_type = 'Appeal'; 
        }

        const myCase = await pool.query('SELECT * FROM cases WHERE id = $1 AND created_by = $2 AND court_type = $3', [id, req.user.id, court_type]);
        if (myCase.rowCount === 0) {
            return res.status(404).json({ message: 'No case found or unauthorized to view this case' });
        }
        res.json(myCase.rows[0]);

    } catch (err) {
        res.status(400).send(err.message);
    }
});



router.post('/', verifyToken, checkRole(['districtUser', 'regionalUser', 'admin']), async (req, res) => {
    try {
        const { case_number, first_name, second_name, case_origin, case_type, case_code, date } = req.body;
        const created_by = req.user.id;

        let court_type;
        if (req.user.role === 'districtUser') {
            court_type = 'District';
        } else if (req.user.role === 'regionalUser') {
            court_type = 'Regional';
        } else if (req.user.role === 'admin') {
            court_type = 'Appeal'; 
        }

       
        const newCase = await pool.query(
            'INSERT INTO cases (case_number, first_name, second_name, case_origin, case_type, court_type, case_code, date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [case_number, first_name, second_name, case_origin, case_type, court_type, case_code, date, created_by]
        );

        res.status(201).json(newCase.rows[0]);

    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.put('/:id', verifyToken, checkRole(['districtUser', 'regionalUser', 'admin']), async (req, res) => {
    const { id } = req.params;
    const { case_number, first_name, second_name, case_origin, case_type, case_code, date, case_finish_date, court_decision, has_appeal } = req.body;
    
    const normalızeDates = (date) => {
        const localDate = new Date(date);
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
        return localDate.toISOString().split('T')[0];
    }

    const normalizedDate = date ? normalızeDates(date) : null;
    const normalizedFinishDate = case_finish_date ? normalızeDates(case_finish_date) : null;

    try {
        let court_type = '';
        if (req.user.role === 'districtUser') {
            court_type = 'District';
        } else if (req.user.role === 'regionalUser') {
            court_type = 'Regional';
        } else if (req.user.role === 'admin') {
            court_type = 'Appeal'; 
        }

        const query = `UPDATE cases 
                       SET case_number = $1, 
                           first_name = $2, 
                           second_name = $3, 
                           case_origin = $4, 
                           case_type = $5, 
                           case_code = $6, 
                           date = $7, 
                           case_finish_date = $8, 
                           court_decision = $9,
                           has_appeal = $10 
                       WHERE id = $11 AND court_type = $12 
                       RETURNING *`;
        const queryParams = [case_number, first_name, second_name, case_origin, case_type, case_code,
            normalizedDate, normalizedFinishDate,
            court_decision, has_appeal, id, court_type ];

        const updatedCase = await pool.query(query, queryParams);

        if (updatedCase.rowCount === 0) {
            return res.status(404).json({ message: 'No case found or unauthorized to update this case' });
        }
        res.json(updatedCase.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



router.delete('/:id', verifyToken, checkRole(['admin', 'districtUser', 'regionalUser']), async (req, res) => {
    const { id } = req.params;

    try {
        let court_type = '';
        if (req.user.role === 'districtUser') {
            court_type = 'District';
        } else if (req.user.role === 'regionalUser') {
            court_type = 'Regional';
        } else if (req.user.role === 'admin') {
            court_type = 'Appeal'; 
        }

        
        const query = 'DELETE FROM cases WHERE id = $1 AND court_type = $2 RETURNING *';
        const queryParams = [id, court_type];

        const deletedCase = await pool.query(query, queryParams);

        if (deletedCase.rowCount === 0) {
            return res.status(404).json({ message: 'No case found or unauthorized to delete this case' });
        }

        res.json(deletedCase.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



export default router;