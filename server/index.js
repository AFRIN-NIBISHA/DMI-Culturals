const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./db');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB and Start Server
initDb().then(db => {
    app.set('db', db);

    // Routes
    app.use('/api/auth', authRoutes);

    // Basic Route
    app.get('/', (req, res) => {
        res.send('DMI College Fest Management API is Running');
    });

    // Events Route
    app.get('/api/events', async (req, res) => {
        const events = await db.all('SELECT * FROM events');
        res.json(events);
    });

    // Houses Route
    app.get('/api/houses', async (req, res) => {
        const houses = await db.all('SELECT * FROM houses');
        res.json(houses);
    });

    // Announcements Route
    // Announcements - Public GET
    app.get('/api/announcements', async (req, res) => {
        try {
            const ann = await db.all('SELECT * FROM announcements ORDER BY created_at DESC');
            res.json(ann);
        } catch (err) { res.status(500).json({ message: 'Error' }); }
    });

    // Site Settings - Public GET
    app.get('/api/settings', async (req, res) => {
        try {
            const rows = await db.all('SELECT * FROM settings');
            const data = {};
            rows.forEach(r => data[r.key] = r.value);
            res.json(data);
        } catch (err) { res.status(500).json({ message: 'Error' }); }
    });

    // Admin: Manage Settings
    app.post('/api/admin/settings', async (req, res) => {
        const { key, value } = req.body;
        try {
            await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
            res.json({ message: 'Settings updated' });
        } catch (err) { res.status(500).json({ message: 'Error' }); }
    });

    // Admin: Add Announcement
    app.post('/api/admin/announcements', async (req, res) => {
        const { title, content } = req.body;
        try {
            await db.run('INSERT INTO announcements (title, content) VALUES (?, ?)', [title, content]);
            res.json({ message: 'Announcement added' });
        } catch (err) { res.status(500).json({ message: 'Error' }); }
    });

    // Admin: Delete Announcement
    app.delete('/api/admin/announcements/:id', async (req, res) => {
        try {
            await db.run('DELETE FROM announcements WHERE id = ?', [req.params.id]);
            res.json({ message: 'Announcement deleted' });
        } catch (err) { res.status(500).json({ message: 'Error' }); }
    });

    // Gallery Endpoints
    app.get('/api/gallery', async (req, res) => {
        try {
            const items = await db.all('SELECT * FROM gallery');
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching gallery' });
        }
    });

    app.post('/api/admin/gallery/:id', async (req, res) => {
        const { id } = req.params;
        const { image_url } = req.body;
        try {
            await db.run('UPDATE gallery SET image_url = ? WHERE id = ?', [image_url, id]);
            res.json({ message: 'Gallery updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating gallery' });
        }
    });

    app.post('/api/admin/gallery/add', async (req, res) => {
        const { image_url, category } = req.body;
        try {
            await db.run('INSERT INTO gallery (image_url, category) VALUES (?, ?)', [image_url, category]);
            res.json({ message: 'Photo added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding photo' });
        }
    });

    app.delete('/api/admin/gallery/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await db.run('DELETE FROM gallery WHERE id = ?', [id]);
            res.json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting' });
        }
    });

    app.get('/api/admin/students', async (req, res) => {
        try {
            const students = await db.all(`
                SELECT r.id, r.reg_type, r.event_name, r.status, r.created_at,
                       u.name, u.email, s.reg_no, s.dept, s.year, h.name as house_name 
                FROM registrations r
                JOIN students s ON r.student_id = s.id
                JOIN users u ON s.user_id = u.id
                LEFT JOIN houses h ON s.house_id = h.id
                ORDER BY r.created_at DESC
            `);
            res.json(students);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching registrations' });
        }
    });

    app.delete('/api/admin/registrations/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await db.run('DELETE FROM registrations WHERE id = ?', [id]);
            res.json({ message: 'Registration deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting registration' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
