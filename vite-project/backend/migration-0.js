const { Pool } = require('pg');

// Конфигурация для подключения к PostgreSQL (без указания базы данных)
const config = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres' // Подключаемся к стандартной базе для создания новой
};

const dbName = 'furniture_store';

async function recreateDatabase() {
  const pool = new Pool(config);
  let client;

  try {
    console.log('🔗 Подключаемся к PostgreSQL...');
    client = await pool.connect();

    const dbCheck = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (dbCheck.rows.length > 0) {
      console.log(`База данных "${dbName}" существует, удаляем...`);
      
      await client.query(`
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = $1 AND pid <> pg_backend_pid()
      `, [dbName]);
      
      await client.query(`DROP DATABASE ${dbName}`);
      console.log(`✅ База данных "${dbName}" успешно удалена`);
    }

    console.log(`🆕 Создаем базу данных "${dbName}"...`);
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ База данных "${dbName}" успешно создана`);

  } catch (error) {
    console.error('❌ Ошибка при пересоздании базы данных:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

async function createTables() {
  
  const pool = new Pool({
    ...config,
    database: dbName
  });

  let client;

  try {
    console.log(`🔗 Подключаемся к базе данных "${dbName}"...`);
    client = await pool.connect();

    console.log('🗂️  Создаем таблицы...');

    // Таблица категорий
    await client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE
      )
    `);
    console.log('✅ Таблица "categories" создана');

    // Таблица продуктов
    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_data BYTEA,
        image_mime_type VARCHAR(50),
        category_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица "products" создана');

    // Таблица изображений продуктов
    await client.query(`
      CREATE TABLE product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        image_data BYTEA NOT NULL,
        image_mime_type VARCHAR(50) NOT NULL,
        image_name VARCHAR(255),
        is_main BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица "product_images" создана');

    // Таблица деталей продуктов
    await client.query(`
      CREATE TABLE product_details (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        full_description TEXT,
        features JSONB NOT NULL DEFAULT '[]',
        specifications JSONB NOT NULL DEFAULT '[]',
        in_stock BOOLEAN DEFAULT true,
        fast_delivery BOOLEAN DEFAULT false,
        warranty VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица "product_details" создана');

    // Таблица пользователей
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);
    console.log('✅ Таблица "users" создана');

    // Таблица корзины
    await client.query(`
      CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);
    console.log('✅ Таблица "cart" создана');

    console.log('\n🎉 Все таблицы успешно созданы!');
    console.log('\n📊 Структура базы данных:');
    console.log('1. categories - категории товаров');
    console.log('2. products - основные данные продуктов');
    console.log('3. product_images - изображения продуктов');
    console.log('4. product_details - детальная информация о продуктах');
    console.log('5. users - пользователи');
    console.log('6. cart - корзина покупок');

  } catch (error) {
    console.error('❌ Ошибка при создании таблиц:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

async function main() {
  try {
    console.log('🚀 Начинаем пересоздание базы данных...\n');
    
    await recreateDatabase();
    console.log('\n---\n');
    await createTables();
    
    console.log('\n✨ База данных успешно пересоздана и настроена!');
  } catch (error) {
    console.error('\n💥 Произошла ошибка:', error);
    process.exit(1);
  }
}

// Запускаем основной процесс
main();