import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from './utils/verifyToken.js';

import pool from './db.js';
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, role]
        );
        const { password: pass, ...user } = newUser.rows[0];
        res.status(201).json(user);
``
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err.message);
    }
});



router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        if (user.rows.length === 0) {
            return res.status(400).send('User not found');
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).send('either user or password is wrong');
        }
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, {
            expiresIn: '4w'
        });
        const { password: pass, ...userInfo } = user.rows[0];
        res.cookie('token', token, { httpOnly: true })
            .status(200)
            .json(userInfo);

    } catch (err) {
        res.status(400).send(err.message);
    }
});



router.put('/change-password', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).send('Please enter all fields');
        }

        const userId = req.user.id;

        // Fetch user from database
        const user = await pool.query(
            'SELECT password FROM users WHERE id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate old password
        const validPassword = await bcrypt.compare(oldPassword, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        // Hash new password and update in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

        // Send success response
        return res.status(200).json({ message: 'Password successfully updated.' });
    } catch (err) {
        console.error(err); // Log error for debugging
        return res.status(500).send(err.message);
    }
});



export default router;