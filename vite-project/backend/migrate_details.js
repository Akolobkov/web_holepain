// migrate-product-details.js
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'furniture_store',
    user: 'postgres',
    password: 'postgres',
});

// Данные из вашего React компонента
const productDetailsData = [
    {
        product_id: 1,
        full_description: "Стильный кухонный гарнитур 'Милена' выполнен в классическом белом цвете. Идеальное решение для современной кухни. Качественные материалы и продуманная эргономика делают эту кухню практичной и удобной в использовании.",
        images: ['Kuhgar.webp', 'Kuhgar.webp', 'Kuhgar.webp'],
        features: [
            "Фасад: белый арт",
            "Корпус: белый",
            "Столешница: влагостойкая",
            "Фурнитура: Blum",
            "Гарантия: 2 года"
        ],
        specifications: [
            { name: "Ширина", value: "280 см" },
            { name: "Глубина", value: "60 см" },
            { name: "Высота", value: "220 см" },
            { name: "Материал фасада", value: "ЛДСП" },
            { name: "Материал корпуса", value: "ЛДСП" },
            { name: "Страна производства", value: "Россия" }
        ],
        in_stock: true,
        fast_delivery: true,
        warranty: "24 месяца"
    },
    {
        product_id: 2,
        full_description: "Современная модульная кухня в стиле глянец с элегантным оливковым цветом. Модульная система позволяет адаптировать кухню под любое помещение.",
        images: ['Modkuh.webp', 'Modkuh.webp', 'Modkuh.webp'],
        features: [
            "Фасад: олива глянец",
            "Корпус: белый",
            "Модульная система",
            "Современный дизайн",
            "Легкость в уходе"
        ],
        specifications: [
            { name: "Тип", value: "Модульная" },
            { name: "Цвет", value: "Олива глянец" },
            { name: "Материал", value: "МДФ" },
            { name: "Покрытие", value: "Глянцевое" }
        ],
        in_stock: true,
        fast_delivery: true,
        warranty: "36 месяцев"
    },
    {
        product_id: 3,
        full_description: "Практичный нижний шкаф для кухни. Идеальное решение для хранения кухонной утвари и продуктов. Качественная фурнитура обеспечивает долгий срок службы.",
        images: ['kuhmod.webp', 'kuhmod.webp', 'kuhmod.webp'],
        features: [
            "Фасад: дерево",
            "Вместительный",
            "Качественная фурнитура",
            "Легкий монтаж"
        ],
        specifications: [
            { name: "Ширина", value: "80 см" },
            { name: "Глубина", value: "60 см" },
            { name: "Высота", value: "85 см" },
            { name: "Количество полок", value: "2" }
        ],
        in_stock: true,
        fast_delivery: false,
        warranty: "12 месяцев"
    },
    {
        product_id: 4,
        full_description: "Прочная и долговечная столешница длиной 2,9 метра. Устойчива к влаге и механическим повреждениям. Идеально подходит для кухонных гарнитуров.",
        images: ['stol.jpg', 'stol.jpg', 'stol.jpg'],
        features: [
            "Длина: 2,9 м",
            "Цвет: семолина",
            "Влагостойкая",
            "Устойчива к повреждениям"
        ],
        specifications: [
            { name: "Длина", value: "290 см" },
            { name: "Глубина", value: "60 см" },
            { name: "Толщина", value: "28 мм" },
            { name: "Материал", value: "ЛДСП" }
        ],
        in_stock: true,
        fast_delivery: true,
        warranty: "12 месяцев"
    },
    {
        product_id: 5,
        full_description: "Элегантная модульная спальня в стиле 'Венеция'. Нежный жемчужный цвет создает атмосферу уюта и гармонии в спальне.",
        images: ['ModSpal.webp', 'ModSpal.webp', 'ModSpal.webp'],
        features: [
            "Фасад: жемчуг",
            "Корпус: белый",
            "Модульная система",
            "Вместительные шкафы",
            "Элегантный дизайн"
        ],
        specifications: [
            { name: "Комплектация", value: "Шкаф, комод, тумбы" },
            { name: "Цвет", value: "Жемчуг/белый" },
            { name: "Материал", value: "ЛДСП" },
            { name: "Стиль", value: "Современный" }
        ],
        in_stock: true,
        fast_delivery: true,
        warranty: "24 месяца"
    },
    {
        product_id: 6,
        full_description: "Компактная и удобная кровать Ронда КР-140. Ортопедическое основание обеспечивает комфортный сон. Стильный дизайн в цвете белое дерево.",
        images: ['krovati.webp', 'krovati.webp', 'krovati.webp'],
        features: [
            "Размер: 140 см",
            "Цвет: белое дерево",
            "Ортопедическое основание",
            "Простая сборка"
        ],
        specifications: [
            { name: "Ширина", value: "140 см" },
            { name: "Длина", value: "200 см" },
            { name: "Высота", value: "90 см" },
            { name: "Материал", value: "ЛДСП" }
        ],
        in_stock: true,
        fast_delivery: true,
        warranty: "18 месяцев"
    },
    {
        product_id: 7,
        full_description: "Роскошный комплект гостиной 'Николь' сочетает в себе нежный цвет софт айвори и благородный дуб крафт серый. Идеальное решение для просторной гостиной.",
        images: ['gost.webp', 'gost.webp', 'gost.webp'],
        features: [
            "Фасад: софт айвори",
            "Корпус: дуб крафт серый",
            "Вместительные секции",
            "Стильный дизайн",
            "Качественная сборка"
        ],
        specifications: [
            { name: "Комплектация", value: "Диван, шкафы, полки" },
            { name: "Общая длина", value: "420 см" },
            { name: "Высота", value: "220 см" },
            { name: "Материал", value: "ЛДСП" }
        ],
        in_stock: true,
        fast_delivery: true,
        warranty: "24 месяца"
    }
];

async function migrateProductDetails() {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Starting product details migration...');
        await client.query('BEGIN');

        // Проверяем существующие данные
        const { rows: existingRows } = await client.query(
            'SELECT COUNT(*) as count FROM product_details'
        );
        
        if (parseInt(existingRows[0].count) > 0) {
            console.log('🗑️  Clearing existing product details...');
            await client.query('DELETE FROM product_details');
        }

        // Вставляем данные
        for (const productDetail of productDetailsData) {
            await client.query(
                `INSERT INTO product_details (
                    product_id, full_description, images, features, 
                    specifications, in_stock, fast_delivery, warranty
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    productDetail.product_id,
                    productDetail.full_description,
                    JSON.stringify(productDetail.images),
                    JSON.stringify(productDetail.features),
                    JSON.stringify(productDetail.specifications),
                    productDetail.in_stock,
                    productDetail.fast_delivery,
                    productDetail.warranty
                ]
            );
            console.log(`✅ Added details for product ID: ${productDetail.product_id}`);
        }

        await client.query('COMMIT');
        console.log('🎉 Product details migration completed successfully!');
        console.log(`📊 Total records migrated: ${productDetailsData.length}`);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error during migration:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrateProductDetails();