// backend/add-images-to-db.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'furniture_store',
    user: 'postgres',
    password: 'postgres',
});

const productImages = [
    {
        productTitle: "Кухонный гарнитур 'Милена'",
        imagePath: '../src/img/Kuhgar.webp'
    },
    {
        productTitle: "Модульная кухня 'Олива Глянец'",
        imagePath: '../src/img/Modkuh.webp'
    },
    {
        productTitle: "Шкаф нижний 'Под яды'",
        imagePath: '../src/img/kuhmod.webp'
    },
    {
        productTitle: "Столешница 2,9м",
        imagePath: '../src/img/stol.jpg'
    },
    {
        productTitle: "Модульная спальня 'Венеция'",
        imagePath: '../src/img/ModSpal.webp'
    },
    {
        productTitle: "Кровать Ронда КР-140 с основанием ЛДСП",
        imagePath: '../src/img/krovati.webp'
    },
    {
        productTitle: "Комплект гостиной Николь",
        imagePath: '../src/img/gost.webp'
    },
    {
        productTitle: "Основание для кровати Ронда КР-160",
        imagePath: '../src/img/ce878f16f3a311ec8146ac1f6b289bea_0526233cd38511eda56200155dfd1d02.jpg.webp'
    },
    {
        productTitle: "Модульная гостиная Эмма",
        imagePath: '../src/img/1-60.webp'
    },
    {
        productTitle: "Тумба под ТВ Нанси ТБ-1600",
        imagePath: '../src/img/Nancy.webp'
    }
];

function imageToBuffer(filePath) {
    try {
        const fullPath = path.join(__dirname, filePath);
        console.log(`Looking for image: ${fullPath}`);
        
        if (!fs.existsSync(fullPath)) {
            console.log('❌ File not found:', fullPath);
            return null;
        }

        const imageBuffer = fs.readFileSync(fullPath);
        
        // Определяем MIME-тип по расширению
        let mimeType = 'image/jpeg';
        if (filePath.endsWith('.png')) mimeType = 'image/png';
        if (filePath.endsWith('.webp')) mimeType = 'image/webp';
        if (filePath.endsWith('.gif')) mimeType = 'image/gif';
        
        return {
            buffer: imageBuffer,
            mimeType: mimeType
        };
    } catch (error) {
        console.error('❌ Error reading image:', error);
        return null;
    }
}

async function addImagesToDatabase() {
    try {
        console.log('🖼️ Adding images to database...\n');
        
        let successCount = 0;
        let errorCount = 0;

        for (const item of productImages) {
            console.log(`\n📝 Processing: ${item.productTitle}`);
            
            const imageInfo = imageToBuffer(item.imagePath);
            
            if (imageInfo) {
                try {
                    // Обновляем товар в базе данных
                    const result = await pool.query(
                        `UPDATE products 
                         SET image_data = $1, image_mime_type = $2 
                         WHERE title = $3
                         RETURNING id`,
                        [imageInfo.buffer, imageInfo.mimeType, item.productTitle]
                    );
                    
                    if (result.rows.length > 0) {
                        console.log(`✅ Image added to: ${item.productTitle} (ID: ${result.rows[0].id})`);
                        successCount++;
                    } else {
                        console.log(`❌ Product not found: ${item.productTitle}`);
                        errorCount++;
                    }
                } catch (dbError) {
                    console.log(`❌ Database error for: ${item.productTitle}`, dbError.message);
                    errorCount++;
                }
            } else {
                console.log(`❌ Image not found for: ${item.productTitle}`);
                errorCount++;
            }
        }
        
        console.log(`\n🎉 Finished! Success: ${successCount}, Errors: ${errorCount}`);
        
    } catch (error) {
        console.error('❌ General error:', error);
    } finally {
        await pool.end();
    }
}

addImagesToDatabase();