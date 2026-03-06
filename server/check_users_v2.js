const { initDb } = require('./db');
async function check() {
    const db = await initDb();
    const users = await db.all('SELECT id, name, email, role FROM users');
    users.forEach(u => console.log(JSON.stringify(u)));
    process.exit(0);
}
check();
