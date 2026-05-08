const pool = require("../config/db");

async function dbHealthCheck(req, res, next) {
    try {
        await pool.query('SELECT 1'); // Query dummy untuk cek koneksi
        next();
    } catch (err) {
        console.error('Database connection lost:', err.message);
        return res.status(503).json({ error: 'Database is currently unavailable. Please try again later.' });
    }
}

module.exports = dbHealthCheck;