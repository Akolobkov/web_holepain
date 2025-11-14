// controllers/productsController.js
const db = require('../database');

const productsController = {
    getAllProducts: async (req, res) => {
        try {
            console.log('Fetching all products from database...');
            
            const query = `
                SELECT 
                    p.id,
                    p.title,
                    p.description,
                    p.price,
                    p.image_data,
                    p.image_mime_type,
                    c.slug as category
                FROM products p
                JOIN categories c ON p.category_id = c.id
                ORDER BY c.id, p.id
            `;

            const result = await db.query(query);
            
            const products = {
                kitchens: [],
                bedrooms: [],
                gostinniye: []
            };

            result.rows.forEach(product => {
                let imageUrl = null;
                if (product.image_data && product.image_mime_type) {
                    const base64Image = Buffer.from(product.image_data).toString('base64');
                    imageUrl = `data:${product.image_mime_type};base64,${base64Image}`;
                }

                const processedProduct = {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: parseFloat(product.price),
                    image: imageUrl,
                    category: product.category
                };

                if (products[product.category]) {
                    products[product.category].push(processedProduct);
                }
            });

            console.log(`Found: ${products.kitchens.length} kitchens, ${products.bedrooms.length} bedrooms, ${products.gostinniye.length} gostinniye`);
            
            res.json(products);
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            res.status(500).json({ 
                error: 'Failed to fetch products',
                details: error.message 
            });
        }
    }
};

module.exports = productsController;