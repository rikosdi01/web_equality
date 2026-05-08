const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 30000, // opsional, idle timeout 30 detik
    connectionTimeoutMillis: 2000 // opsional, 2 detik timeout jika tidak bisa connect
});

// Handle error pada idle clients
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    // Optional: bisa tambahkan mekanisme notifikasi atau restart pool
});

module.exports = pool;
