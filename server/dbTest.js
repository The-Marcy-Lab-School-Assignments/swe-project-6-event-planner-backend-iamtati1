const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

async function testDB() {
    try {
        const result = await pool.query("SELECT NOW();");
        console.log("✅ Connected to PostgreSQL!");
        console.log("🕒 Server time:", result.rows[0].now);
    } catch (err) {
        console.error("❌ Connection failed:");
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

testDB();