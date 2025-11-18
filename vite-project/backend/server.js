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

// Get product details with images from database
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
                p.category_id,
                pd.full_description,
                pd.features,
                pd.specifications,
                pd.in_stock,
                pd.fast_delivery,
                pd.warranty,
                -- Получаем все изображения продукта
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'data', encode(pi.image_data, 'base64'),
                            'mimeType', pi.image_mime_type,
                            'name', pi.image_name,
                            'isMain', pi.is_main,
                            'sortOrder', pi.sort_order
                        )
                        ORDER BY pi.sort_order, pi.id
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'
                ) as images
            FROM products p
            LEFT JOIN product_details pd ON p.id = pd.product_id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = $1
            GROUP BY p.id, pd.id
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const product = result.rows[0];
        
        // Обрабатываем JSON поля
        const features = typeof product.features === 'string' 
            ? JSON.parse(product.features) 
            : (product.features || []);
            
        const specifications = typeof product.specifications === 'string'
            ? JSON.parse(product.specifications)
            : (product.specifications || []);
        
        // Форматируем изображения для фронтенда
        const formattedImages = product.images.map(img => ({
            id: img.id,
            url: `data:${img.mimeType};base64,${img.data}`,
            name: img.name,
            isMain: img.isMain,
            sortOrder: img.sortOrder
        }));
        
        // Находим основное изображение
        const mainImage = formattedImages.find(img => img.isMain) || formattedImages[0];
        
        const response = {
            id: product.id,
            title: product.title,
            description: product.description,
            fullDescription: product.full_description || product.description,
            price: parseFloat(product.price),
            category_id: product.category_id,
            image: mainImage ? mainImage.url : null, // основное изображение
            images: formattedImages, // все изображения
            features: features,
            specifications: specifications,
            inStock: product.in_stock !== false,
            fastDelivery: product.fast_delivery || false,
            warranty: product.warranty || '12 месяцев'
        };
        
        console.log(`✅ Product details loaded: ${product.title}`);
        console.log(`📊 Images: ${response.images.length}, Features: ${response.features.length}`);
        
        res.json(response);
        
    } catch (error) {
        console.error('❌ Error fetching product details:', error);
        res.status(500).json({ 
            error: 'Failed to fetch product details',
            details: error.message 
        });
    }
});
//Авторизация+корзина
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, phone, password, firstName, lastName } = req.body;
        
        console.log('📝 User registration attempt:', { email, phone, firstName });

        // Валидация
        if (!email || !phone || !password || !firstName) {
            return res.status(400).json({ 
                error: 'Все обязательные поля должны быть заполнены' 
            });
        }

        // Проверка существующего пользователя
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 OR phone = $2',
            [email, phone]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                error: 'Пользователь с таким email или телефоном уже существует' 
            });
        }

        // Хеширование пароля (в реальном приложении используйте bcrypt)
        const passwordHash = `hashed_${password}_${Date.now()}`; // Заглушка

        // Создание пользователя
        const { rows: [newUser] } = await db.query(
            `INSERT INTO users (email, phone, first_name, last_name, password_hash) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, email, phone, first_name, last_name, created_at`,
            [email, phone, firstName, lastName, passwordHash]
        );

        console.log('✅ User registered successfully:', newUser.email);

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            user: {
                id: newUser.id,
                email: newUser.email,
                phone: newUser.phone,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                createdAt: newUser.created_at
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            error: 'Ошибка при регистрации',
            details: error.message 
        });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email и пароль обязательны' 
            });
        }

        // Поиск пользователя
        const { rows: users } = await db.query(
            `SELECT id, email, phone, first_name, last_name, password_hash, avatar_data, avatar_mime_type 
             FROM users WHERE email = $1 AND is_active = true`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'Неверный email или пароль' 
            });
        }

        const user = users[0];

        // Проверка пароля (в реальном приложении используйте bcrypt.compare)
        const isValidPassword = password === user.password_hash.replace('hashed_', '').split('_')[0]; // Заглушка

        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Неверный email или пароль' 
            });
        }

        // Обновляем время последнего входа
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Форматируем аватар
        let avatarUrl = null;
        if (user.avatar_data && user.avatar_mime_type) {
            const base64Image = Buffer.from(user.avatar_data).toString('base64');
            avatarUrl = `data:${user.avatar_mime_type};base64,${base64Image}`;
        }

        const userResponse = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: avatarUrl
        };

        console.log('✅ User logged in successfully:', user.email);

        res.json({
            success: true,
            message: 'Вход выполнен успешно',
            user: userResponse
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            error: 'Ошибка при входе в систему',
            details: error.message 
        });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email и пароль обязательны' 
            });
        }

        // Поиск пользователя
        const { rows: users } = await db.query(
            `SELECT id, email, phone, first_name, last_name, password_hash, avatar_data, avatar_mime_type 
             FROM users WHERE email = $1 AND is_active = true`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'Неверный email или пароль' 
            });
        }

        const user = users[0];

        // Проверка пароля (в реальном приложении используйте bcrypt.compare)
        const isValidPassword = password === user.password_hash.replace('hashed_', '').split('_')[0]; // Заглушка

        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Неверный email или пароль' 
            });
        }

        // Обновляем время последнего входа
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Форматируем аватар
        let avatarUrl = null;
        if (user.avatar_data && user.avatar_mime_type) {
            const base64Image = Buffer.from(user.avatar_data).toString('base64');
            avatarUrl = `data:${user.avatar_mime_type};base64,${base64Image}`;
        }

        const userResponse = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: avatarUrl
        };

        console.log('✅ User logged in successfully:', user.email);

        res.json({
            success: true,
            message: 'Вход выполнен успешно',
            user: userResponse
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            error: 'Ошибка при входе в систему',
            details: error.message 
        });
    }
});

// Получение профиля пользователя
app.get('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { rows: users } = await db.query(
            `SELECT id, email, phone, first_name, last_name, avatar_data, avatar_mime_type, 
                    created_at, last_login
             FROM users WHERE id = $1 AND is_active = true`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                error: 'Пользователь не найден' 
            });
        }

        const user = users[0];

        // Форматируем аватар
        let avatarUrl = null;
        if (user.avatar_data && user.avatar_mime_type) {
            const base64Image = Buffer.from(user.avatar_data).toString('base64');
            avatarUrl = `data:${user.avatar_mime_type};base64,${base64Image}`;
        }

        const userResponse = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: avatarUrl,
            createdAt: user.created_at,
            lastLogin: user.last_login
        };

        res.json(userResponse);

    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении данных пользователя',
            details: error.message 
        });
    }
});
app.put('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, phone, avatar } = req.body;

        // Проверяем существование пользователя
        const { rows: users } = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                error: 'Пользователь не найден' 
            });
        }

        // Проверяем уникальность телефона
        if (phone) {
            const existingPhone = await db.query(
                'SELECT id FROM users WHERE phone = $1 AND id != $2',
                [phone, userId]
            );
            if (existingPhone.rows.length > 0) {
                return res.status(409).json({ 
                    error: 'Пользователь с таким телефоном уже существует' 
                });
            }
        }

        // Обработка аватара (если передается base64)
        let avatarData = null;
        let avatarMimeType = null;

        if (avatar && avatar.startsWith('data:')) {
            const matches = avatar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                avatarMimeType = matches[1];
                avatarData = Buffer.from(matches[2], 'base64');
            }
        }

        // Обновляем данные
        const { rows: [updatedUser] } = await db.query(
            `UPDATE users 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 phone = COALESCE($3, phone),
                 avatar_data = COALESCE($4, avatar_data),
                 avatar_mime_type = COALESCE($5, avatar_mime_type),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING id, email, phone, first_name, last_name, avatar_data, avatar_mime_type`,
            [firstName, lastName, phone, avatarData, avatarMimeType, userId]
        );

        // Форматируем аватар для ответа
        let avatarUrl = null;
        if (updatedUser.avatar_data && updatedUser.avatar_mime_type) {
            const base64Image = Buffer.from(updatedUser.avatar_data).toString('base64');
            avatarUrl = `data:${updatedUser.avatar_mime_type};base64,${base64Image}`;
        }

        const userResponse = {
            id: updatedUser.id,
            email: updatedUser.email,
            phone: updatedUser.phone,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            avatar: avatarUrl
        };

        res.json({
            success: true,
            message: 'Профиль успешно обновлен',
            user: userResponse
        });

    } catch (error) {
        console.error('❌ Update user error:', error);
        res.status(500).json({ 
            error: 'Ошибка при обновлении профиля',
            details: error.message 
        });
    }
});
//КОРЗИНА 
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT 
                c.id,
                c.product_id,
                c.quantity,
                c.added_at,
                p.title,
                p.description,
                p.price,
                p.image_data,
                p.image_mime_type,
                pd.in_stock
            FROM cart c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN product_details pd ON p.id = pd.product_id
            WHERE c.user_id = $1
            ORDER BY c.added_at DESC
        `;
        
        const result = await db.query(query, [userId]);
        
        // Форматируем данные
        const cartItems = result.rows.map(item => {
            let imageUrl = null;
            if (item.image_data && item.image_mime_type) {
                const base64Image = Buffer.from(item.image_data).toString('base64');
                imageUrl = `data:${item.image_mime_type};base64,${base64Image}`;
            }
            
            return {
                id: item.id,
                productId: item.product_id,
                title: item.title,
                description: item.description,
                price: parseFloat(item.price),
                quantity: item.quantity,
                image: imageUrl,
                inStock: item.in_stock !== false,
                total: parseFloat(item.price) * item.quantity,
                addedAt: item.added_at
            };
        });
        
        // Вычисляем итоги
        const total = cartItems.reduce((sum, item) => sum + item.total, 0);
        const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        res.json({
            items: cartItems,
            total: total,
            itemsCount: itemsCount
        });
        
    } catch (error) {
        console.error('❌ Get cart error:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении корзины',
            details: error.message 
        });
    }
});

// Добавление товара в корзину
app.post('/api/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity = 1 } = req.body;
        
        console.log('🛒 Add to cart:', { userId, productId, quantity });

        // Проверяем существование пользователя
        const userCheck = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        // Проверяем существование товара
        const productCheck = await db.query(
            'SELECT id, title FROM products WHERE id = $1',
            [productId]
        );
        
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        
        // Проверяем, есть ли уже товар в корзине
        const existingItem = await db.query(
            'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        
        let result;
        if (existingItem.rows.length > 0) {
            // Обновляем количество
            const newQuantity = existingItem.rows[0].quantity + quantity;
            result = await db.query(
                'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
                [newQuantity, existingItem.rows[0].id]
            );
        } else {
            // Добавляем новый товар
            result = await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [userId, productId, quantity]
            );
        }
        
        res.json({ 
            success: true, 
            message: 'Товар добавлен в корзину',
            cartItem: result.rows[0]
        });
        
    } catch (error) {
        console.error('❌ Add to cart error:', error);
        res.status(500).json({ 
            error: 'Ошибка при добавлении в корзину',
            details: error.message 
        });
    }
});

// Обновление количества товара в корзине
app.put('/api/cart/:userId/items/:itemId', async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const { quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json({ error: 'Количество должно быть не менее 1' });
        }
        
        const result = await db.query(
            'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, itemId, userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар в корзине не найден' });
        }
        
        res.json({ 
            success: true, 
            message: 'Количество обновлено',
            cartItem: result.rows[0]
        });
        
    } catch (error) {
        console.error('❌ Update cart error:', error);
        res.status(500).json({ 
            error: 'Ошибка при обновлении корзины',
            details: error.message 
        });
    }
});

// Удаление товара из корзины
app.delete('/api/cart/:userId/items/:itemId', async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        
        const result = await db.query(
            'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
            [itemId, userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар в корзине не найден' });
        }
        
        res.json({ 
            success: true, 
            message: 'Товар удален из корзины'
        });
        
    } catch (error) {
        console.error('❌ Remove from cart error:', error);
        res.status(500).json({ 
            error: 'Ошибка при удалении из корзины',
            details: error.message 
        });
    }
});

// Очистка корзины
app.delete('/api/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const result = await db.query(
            'DELETE FROM cart WHERE user_id = $1 RETURNING *',
            [userId]
        );
        
        res.json({ 
            success: true, 
            message: 'Корзина очищена',
            deletedCount: result.rows.length
        });
        
    } catch (error) {
        console.error('❌ Clear cart error:', error);
        res.status(500).json({ 
            error: 'Ошибка при очистке корзины',
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