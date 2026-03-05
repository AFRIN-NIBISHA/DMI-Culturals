const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('DMI College Fest Backend is Running');
});

// API Routes (Example: Event registrations)
app.post('/api/register', (req, res) => {
    const { name, regNo, email, dept, year, event } = req.body;
    console.log(`Registration received:
        Name: ${name}
        Reg No: ${regNo}
        Email: ${email}
        Dept: ${dept}
        Year: ${year}
        Event: ${event}`);

    // In a real app, you would save this to a database here

    res.status(201).json({
        message: 'Registration Successful',
        data: { name, event }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
