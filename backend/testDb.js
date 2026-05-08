const db = require('./src/config/db');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('DB Connected!', result.rows[0]);
  } catch (err) {
    console.error('DB ERROR:', err);
  }
}

testConnection();
