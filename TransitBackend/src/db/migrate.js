require('dotenv').config();

const fs = require('node:fs/promises');
const path = require('node:path');
const { getConfig, validateConfig } = require('../config');
const { createPool } = require('./pool');

async function migrate() {
  const config = getConfig();
  validateConfig(config);
  const pool = createPool(config);
  try {
    const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Database schema is up to date.');
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error('Database migration failed:', error.message);
  process.exitCode = 1;
});
