import pool from "./db";

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Connection successful:', rows);
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConnection();