// database.js (в корне backend)
const { Pool } = require('pg');
const dbConfig = require('./config/database.config');

const pool = new Pool(dbConfig);

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};