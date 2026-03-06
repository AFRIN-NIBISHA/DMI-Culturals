const { initDb } = require('./db');

async function check() {
    try {
        const db = await initDb();
        const users = await db.all('SELECT id, name, email, role FROM users');
        console.log('Users in DB:', users);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
