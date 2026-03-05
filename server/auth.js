const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dmi_secret_key_2026';

// Register User (Student)
router.post('/register', async (req, res) => {
    const db = req.app.get('db');
    const { name, email, reg_no, dept, year, house_id, phone, reg_type, event_name } = req.body;

    try {
        // 1. Get or Create Student
        let student = await db.get('SELECT id FROM students WHERE reg_no = ?', [reg_no]);
        let studentId;

        if (!student) {
            // Check if user exists (to avoid email conflict)
            let user = await db.get('SELECT id FROM users WHERE email = ?', [email]);
            if (!user) {
                const userResult = await db.run(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [name, email, 'STUDENT_NO_PASSWORD', 'student']
                );
                user = { id: userResult.lastID };
            }

            const studentResult = await db.run(
                'INSERT INTO students (user_id, reg_no, dept, year, house_id, phone) VALUES (?, ?, ?, ?, ?, ?)',
                [user.id, reg_no, dept, year, house_id || null, phone]
            );
            studentId = studentResult.lastID;
        } else {
            studentId = student.id;
        }

        // 2. Check if already registered for THIS specific event
        const existingReg = await db.get(
            'SELECT id FROM registrations WHERE student_id = ? AND event_name = ?',
            [studentId, event_name]
        );

        if (existingReg) {
            return res.status(400).json({ message: `You have already registered for ${event_name}!` });
        }

        // 3. Insert Registration
        await db.run(
            'INSERT INTO registrations (student_id, reg_type, event_name) VALUES (?, ?, ?)',
            [studentId, reg_type, event_name]
        );

        res.status(201).json({ message: `Successfully registered for ${event_name}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const db = req.app.get('db');
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        // Get student details if role is student
        let studentDetails = null;
        if (user.role === 'student' || user.role === 'house_leader') {
            studentDetails = await db.get('SELECT * FROM students WHERE user_id = ?', [user.id]);
        }

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            student: studentDetails
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
