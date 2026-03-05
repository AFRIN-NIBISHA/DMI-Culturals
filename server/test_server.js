const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 6000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is Working');
});

app.post('/api/register', (req, res) => {
    console.log('Received:', req.body);
    res.status(201).json({ message: 'Success', data: req.body });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});
