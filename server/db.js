const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function initDb() {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    // Houses Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS houses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    `);

    // Users Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student' -- admin, student, sports_coordinator, cultural_coordinator, house_leader
        )
    `);

    // Students Table (Extends User)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            reg_no TEXT UNIQUE NOT NULL,
            dept TEXT NOT NULL,
            year TEXT NOT NULL,
            house_id INTEGER,
            phone TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (house_id) REFERENCES houses(id)
        )
    `);

    // Events Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL, -- sports, cultural
            date TEXT,
            time TEXT,
            venue TEXT,
            description TEXT
        )
    `);

    // Registrations Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            reg_type TEXT NOT NULL, -- sports, cultural, food
            event_name TEXT NOT NULL,
            status TEXT DEFAULT 'pending', 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id)
        )
    `);

    // Results Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            position INTEGER, -- 1st, 2nd, 3rd
            points INTEGER,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (student_id) REFERENCES students(id)
        )
    `);

    // Announcements Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Gallery Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            caption TEXT,
            category TEXT -- sports, food, cultural
        )
    `);

    // Seed Initial Data (Houses)
    const houseCount = await db.get('SELECT COUNT(*) as count FROM houses');
    if (houseCount.count === 0) {
        await db.run('INSERT INTO houses (name) VALUES (?), (?), (?), (?)', ['Red House', 'Blue House', 'Green House', 'Yellow House']);
    }

    // Seed Gallery - Use original project images as initial data
    const galleryCount = await db.get('SELECT COUNT(*) as count FROM gallery');
    if (galleryCount.count === 0) {
        await db.run(`INSERT INTO gallery (image_url, category) VALUES 
            ('/src/assets/sports.png', 'sports'),
            ('/src/assets/food.png', 'food'),
            ('/src/assets/cultural.png', 'cultural'),
            ('/src/assets/sports2.png', 'sports'),
            ('/src/assets/food2.png', 'food'),
            ('/src/assets/cultural2.png', 'cultural')
        `);
    }

    // Settings Table for general website content
    await db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    `);

    // Seed Settings if empty
    const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
    if (settingsCount.count === 0) {
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['college_name', 'DMI ENGINEERING COLLEGE']);
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['event_title', 'COLLEGE DAY & SPORTS FEST 2026']);
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['stats_mega_events', '3+']);
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['stats_participants', '1000+']);
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['stats_volunteers', '50+']);
    }

    console.log('Database Initialized Successfully');
    return db;
}

module.exports = { initDb };
