const { initDb } = require('./db');

async function check() {
    try {
        const db = await initDb();
        const houses = await db.all('SELECT * FROM houses');
        console.log('Houses in DB:', houses);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
