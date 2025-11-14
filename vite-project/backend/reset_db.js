const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'furniture_store',
    user: 'postgres',
    password: 'postgres',
});

async function clearDatabase() {
    try {
        console.log('🗑️ Clearing database...\n');
        
        await pool.query('DELETE FROM product_details');
        await pool.query('DELETE FROM products');
        await pool.query('DELETE FROM categories');
        
        await pool.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
        await pool.query('ALTER SEQUENCE product_details_id_seq RESTART WITH 1');
        
        await pool.query(`
            INSERT INTO categories (name, slug) VALUES 
            ('Кухни', 'kitchens'),
            ('Спальни', 'bedrooms'),
            ('Гостиные', 'gostinniye')
        `);
        
        console.log('🎉 Database cleared and reset!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

clearDatabase();