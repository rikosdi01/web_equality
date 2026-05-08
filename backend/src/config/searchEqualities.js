const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // pastikan variabel ini ada di .env
});

async function searchEqualities(query) {
  const result = await pool.query(
    `SELECT *
     FROM equalities
     WHERE data_string ILIKE '%' || $1 || '%'
        OR similarity(data_string, $1) > 0.2
     ORDER BY similarity(data_string, $1) DESC
     LIMIT 50`,
    [query]
  );
  return result.rows;
}

module.exports = searchEqualities;