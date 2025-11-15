// server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 300; 

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Get all products from database
app.get('/api/products', async (req, res) => {
    try {
        console.log('📦 Fetching products from database...');
        
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
        
        // Группируем по категориям
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

        console.log(`✅ Found: ${products.kitchens.length} kitchens, ${products.bedrooms.length} bedrooms, ${products.gostinniye.length} gostinniye`);
        
        res.json(products);
        
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            details: error.message 
        });
    }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(
            `SELECT * FROM products WHERE id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const product = result.rows[0];
        res.json(product);
        
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

app.get('/api/product-details/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📋 Fetching product details for ID: ${id}`);
        
        const query = `
            SELECT 
                p.id,
                p.title,
                p.description,
                p.price,
                p.image_data,
                p.image_mime_type,
                p.category_id,
                pd.full_description,
                pd.features,
                pd.specifications,
                pd.in_stock,
                pd.fast_delivery,
                pd.warranty
            FROM products p
            LEFT JOIN product_details pd ON p.id = pd.product_id
            WHERE p.id = $1
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const product = result.rows[0];
        
        // Форматируем изображение
        let imageUrl = null;
        if (product.image_data && product.image_mime_type) {
            const base64Image = Buffer.from(product.image_data).toString('base64');
            imageUrl = `data:${product.image_mime_type};base64,${base64Image}`;
        }
        
        const images = typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : (product.images || []);
            
        const features = typeof product.features === 'string'
            ? JSON.parse(product.features)
            : (product.features || []);
            
        const specifications = typeof product.specifications === 'string'
            ? JSON.parse(product.specifications)
            : (product.specifications || []);
        
        // Подготавливаем ответ для фронтенда
        const response = {
            id: product.id,
            title: product.title,
            description: product.description,
            fullDescription: product.full_description || product.description,
            price: parseFloat(product.price),
            category_id: product.category_id,
            image: imageUrl,
            images: images.length > 0 ? images : [imageUrl].filter(Boolean),
            features: features,
            specifications: specifications,
            inStock: product.in_stock !== false, // default true
            fastDelivery: product.fast_delivery || false,
            warranty: product.warranty || '12 месяцев'
        };
        
        console.log(`✅ Product details loaded: ${product.title}`);
        console.log(`📊 Images: ${response.images.length}, Features: ${response.features.length}, Specs: ${response.specifications.length}`);
        
        res.json(response);
        
    } catch (error) {
        console.error('❌ Error fetching product details:', error);
        res.status(500).json({ 
            error: 'Failed to fetch product details',
            details: error.message 
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    console.log(`📋 Product details API: http://localhost:${PORT}/api/product-details/1`);
});