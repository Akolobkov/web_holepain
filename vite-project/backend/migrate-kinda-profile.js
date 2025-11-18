// migrate-simple-profile.js
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'furniture_store',
    user: 'postgres',
    password: 'postgres',
});

async function migrateSimpleProfileData() {
    const client = await pool.connect();
    
    try {
        console.log('🛒 Starting simple profile data migration...');
        await client.query('BEGIN');

        // Тестовые пользователи
        const testUsers = [
            {
                email: 'ivan@example.com',
                phone: '+79991234567',
                first_name: 'Иван',
                last_name: 'Иванов',
                password_hash: '$2b$10$examplehashedpassword'
            },
            {
                email: 'maria@example.com',
                phone: '+79997654321',
                first_name: 'Мария',
                last_name: 'Петрова',
                password_hash: '$2b$10$examplehashedpassword2'
            }
        ];

        for (const user of testUsers) {
            const { rows: [newUser] } = await client.query(
                `INSERT INTO users (email, phone, first_name, last_name, password_hash, email_verified, phone_verified)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id`,
                [
                    user.email,
                    user.phone,
                    user.first_name,
                    user.last_name,
                    user.password_hash,
                    true, // email_verified
                    true  // phone_verified
                ]
            );
            console.log(`✅ Added user: ${user.first_name} ${user.last_name}`);

            // Добавляем товары в корзину
            const cartItems = [
                { product_id: 1, quantity: 1 }, // Кухонный гарнитур
                { product_id: 3, quantity: 2 }, // Шкаф нижний
                { product_id: 6, quantity: 1 }  // Кровать
            ];

            for (const item of cartItems) {
                await client.query(
                    `INSERT INTO cart (user_id, product_id, quantity)
                     VALUES ($1, $2, $3)`,
                    [newUser.id, item.product_id, item.quantity]
                );
            }
            console.log(`✅ Added ${cartItems.length} items to cart for user ${newUser.id}`);
        }

        await client.query('COMMIT');
        console.log('🎉 Simple profile data migration completed successfully!');
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error during profile data migration:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrateSimpleProfileData();