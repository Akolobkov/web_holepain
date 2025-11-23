const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'furniture_store',
    user: 'postgres',
    password: 'postgres',
});
async function addCategoryData() {
    try {
        console.log('📝 Adding categories to database...');
        
        await pool.query(
            `INSERT INTO categories (name, slug) VALUES 
            ('Кухни', 'kitchens'),
            ('Спальни', 'bedrooms'),
            ('Гостиные', 'gostinniye');`,
        );
        

        console.log('🎉 Sample data added successfully!');
        
    } catch (error) {
        console.error('❌ Error adding sample data:', error);
    } finally {
        await pool.end();
    }
}
addCategoryData();