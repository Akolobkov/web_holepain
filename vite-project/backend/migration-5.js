// migrate-images.js
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

const productImagesMap = {
    1: ['Kuhgar.webp', 'milena2.webp', 'milena3.webp'],
    2: ['Modkuh.webp', 'oliva2.webp', 'oliva3.webp'],
    3: ['kuhmod.webp', 'kuhmod2.webp', 'kuhmod3.webp'],
    4: ['stol.jpg', 'ЕБЕЙШАЯСТОЛЕШНИЦА.webp', 'badwomannomilk.jpg'],
    5: ['ModSpal.webp', 'venecia2.webp', 'venecia3.webp'],
    6: ['krovati.webp', 'ronda2.webp', 'ronda3.webp'],
    7: ['ce878f16f3a311ec8146ac1f6b289bea_0526233cd38511eda56200155dfd1d02.jpg.webp', 'base2.webp', 'base3.jpg'],
    8: ['gost.webp', 'nicole2.webp', 'nicole3.jpg'],
    9: ['1-60.webp', 'emma2.webp', 'emma3.webp'],
    10: ['Nancy.webp', 'nancy2.webp', 'nancy3.webp']
};

async function migrateImages() {
    const client = await pool.connect();
    
    try {
        console.log('🖼️ Starting images migration...');
        await client.query('BEGIN');

        await client.query('DELETE FROM product_images');

        for (const [productId, imageNames] of Object.entries(productImagesMap)) {
            for (let i = 0; i < imageNames.length; i++) {
                const imageName = imageNames[i];
                const imagePath = path.join(__dirname, '../src/img', imageName);
                
                try {
                    // Читаем файл изображения
                    const imageBuffer = fs.readFileSync(imagePath);
                    
                    // Определяем MIME type
                    const mimeType = getMimeType(imageName);
                    
                    await client.query(
                        `INSERT INTO product_images (product_id, image_data, image_mime_type, image_name, is_main, sort_order) 
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            productId,
                            imageBuffer,
                            mimeType,
                            imageName,
                            i === 0, 
                            i
                        ]
                    );
                    
                    console.log(`✅ Added image for product ${productId}: ${imageName}`);
                    
                } catch (fileError) {
                    console.warn(`⚠️ Could not read image ${imagePath}: ${fileError.message}`);
                }
            }
        }

        await client.query('COMMIT');
        console.log('🎉 Images migration completed successfully!');
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error during images migration:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

migrateImages();