import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './Profile.module.css';

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    // Загрузка данных пользователя
    useEffect(() => {
        loadUserData();
        if (activeTab === 'orders') {
            loadCartData();
        }
    }, [activeTab, id]);

    const loadUserData = async () => {
        setIsLoading(true);
        try {
            // Получаем пользователя из localStorage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                setUserData(user);
                setFormData(user);
                
                // Проверяем, совпадает ли ID в URL с текущим пользователем
                if (id && user.id != id) {
                    console.warn('ID в URL не совпадает с текущим пользователем');
                }
            } else {
                // Если пользователь не найден, перенаправляем на вход
                navigate('/login');
                return;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            alert('Ошибка загрузки данных пользователя');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCartData = async () => {
        if (!userData) return;
        
        setCartLoading(true);
        try {
            const response = await fetch(`http://localhost:300/api/cart/${userData.id}`);
            const data = await response.json();
            
            if (data.success !== false) {
                setCartItems(data.items || []);
            } else {
                console.error('Error loading cart:', data.error);
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartItems([]);
        } finally {
            setCartLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = 'Номер телефона обязателен';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // В реальном приложении здесь будет запрос к API
            // const response = await fetch(`/api/users/${userData.id}`, {...});
            
            // Временно сохраняем в localStorage
            const updatedUser = { ...formData };
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setIsEditing(false);
            alert('Профиль успешно обновлен!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Ошибка при сохранении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData(userData || {});
        setIsEditing(false);
        setErrors({});
    };

    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            navigate('/');
            alert('Вы вышли из системы');
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:300/api/cart/${userData.id}/items/${itemId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Обновляем корзину
                loadCartData();
                alert('Товар удален из корзины');
            } else {
                alert('Ошибка при удалении товара: ' + data.error);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('Ошибка при удалении товара');
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            const response = await fetch(`http://localhost:300/api/cart/${userData.id}/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                loadCartData();
            } else {
                alert('Ошибка при обновлении количества: ' + data.error);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Ошибка при обновлении количества');
        }
    };

    // Вычисляем общую сумму корзины
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (isLoading && !userData) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка профиля...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.error}>
                    <h2>Пользователь не найден</h2>
                    <p>Пожалуйста, войдите в систему</p>
                    <button 
                        className={styles.primaryButton}
                        onClick={() => navigate('/login')}
                    >
                        Войти
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.profileHeader}>
                        <h1 className={styles.title}>Личный кабинет</h1>
                        <p className={styles.subtitle}>Добро пожаловать, {userData.firstName}!</p>
                    </div>

                    <div className={styles.profileLayout}>
                        {/* Боковая навигация */}
                        <div className={styles.sidebar}>
                            <nav className={styles.nav}>
                                <button 
                                    className={`${styles.navItem} ${activeTab === 'personal' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('personal')}
                                >
                                    👤 Личные данные
                                </button>
                                <button 
                                    className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    🛒 Корзина
                                </button>
                                <button 
                                    className={`${styles.navItem} ${activeTab === 'security' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    🔐 Безопасность
                                </button>
                                <button 
                                    className={`${styles.navItem} ${styles.logout}`}
                                    onClick={handleLogout}
                                >
                                    🚪 Выйти
                                </button>
                            </nav>
                        </div>

                        {/* Основной контент */}
                        <div className={styles.mainContent}>
                            {/* Вкладка личных данных */}
                            {activeTab === 'personal' && (
                                <div className={styles.tabContent}>
                                    <div className={styles.sectionHeader}>
                                        <h2>Личные данные</h2>
                                        {!isEditing && (
                                            <button 
                                                className={styles.editButton}
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Редактировать
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleSaveProfile}>
                                        

                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Имя *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName || ''}
                                                    onChange={handleInputChange}
                                                    className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                                                    disabled={!isEditing}
                                                    placeholder="Введите ваше имя"
                                                />
                                                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Фамилия</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName || ''}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    disabled={!isEditing}
                                                    placeholder="Введите вашу фамилию"
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email || ''}
                                                    onChange={handleInputChange}
                                                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                                                    disabled={!isEditing}
                                                    placeholder="your@email.com"
                                                />
                                                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Телефон *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone || ''}
                                                    onChange={handleInputChange}
                                                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                                                    disabled={!isEditing}
                                                    placeholder="+7 (999) 123-45-67"
                                                />
                                                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className={styles.formActions}>
                                                <button 
                                                    type="submit" 
                                                    className={styles.saveButton}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                                                </button>
                                                <button 
                                                    type="button"
                                                    className={styles.cancelButton}
                                                    onClick={handleCancelEdit}
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            )}

                            {/* Вкладка корзины */}
                            {activeTab === 'orders' && (
                                <div className={styles.tabContent}>
                                    <h2>Корзина</h2>
                                    
                                    {cartLoading ? (
                                        <div className={styles.loading}>
                                            <div className={styles.spinner}></div>
                                            <p>Загрузка корзины...</p>
                                        </div>
                                    ) : cartItems.length === 0 ? (
                                        <div className={styles.emptyState}>
                                            <div className={styles.emptyIcon}>🛒</div>
                                            <h3>Корзина пуста</h3>
                                            <p>Добавьте товары из каталога</p>
                                            <button 
                                                className={styles.primaryButton}
                                                onClick={() => navigate('/catalog')}
                                            >
                                                Перейти в каталог
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.cartItems}>
                                            {cartItems.map(item => (
                                                <div key={item.id} className={styles.cartItem}>
                                                    <img 
                                                        src={item.image || '/default-product.png'} 
                                                        alt={item.title}
                                                        className={styles.cartItemImage}
                                                    />
                                                    <div className={styles.cartItemInfo}>
                                                        <h4 className={styles.cartItemTitle}>{item.title}</h4>
                                                        <div className={styles.cartItemPrice}>
                                                            {item.price?.toLocaleString('ru-RU')} ₽
                                                        </div>
                                                    </div>
                                                    <div className={styles.cartItemActions}>
                                                        <div className={styles.quantityControls}>
                                                            <button 
                                                                className={styles.quantityButton}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className={styles.quantity}>{item.quantity}</span>
                                                            <button 
                                                                className={styles.quantityButton}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button 
                                                            className={styles.removeButton}
                                                            onClick={() => handleRemoveFromCart(item.id)}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                    <div className={styles.cartItemTotal}>
                                                        {((item.price || 0) * item.quantity).toLocaleString('ru-RU')} ₽
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className={styles.cartSummary}>
                                                <div className={styles.cartTotal}>
                                                    Итого: {cartTotal.toLocaleString('ru-RU')} ₽
                                                </div>
                                                <button className={styles.checkoutButton}>
                                                    Оформить заказ
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Вкладка безопасности */}
                            {activeTab === 'security' && (
                                <div className={styles.tabContent}>
                                    <h2>Безопасность</h2>
                                    
                                    <div className={styles.securitySection}>
                                        <h3>Смена пароля</h3>
                                        <form className={styles.securityForm}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Текущий пароль</label>
                                                <input
                                                    type="password"
                                                    className={styles.input}
                                                    placeholder="Введите текущий пароль"
                                                />
                                            </div>
                                            
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Новый пароль</label>
                                                <input
                                                    type="password"
                                                    className={styles.input}
                                                    placeholder="Введите новый пароль"
                                                />
                                            </div>
                                            
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Подтвердите новый пароль</label>
                                                <input
                                                    type="password"
                                                    className={styles.input}
                                                    placeholder="Повторите новый пароль"
                                                />
                                            </div>
                                            
                                            <button type="submit" className={styles.saveButton}>
                                                Обновить пароль
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Profile;