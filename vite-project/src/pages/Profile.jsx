import { useState, useEffect } from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './Profile.module.css';

function Profile() {
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState({
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        avatar: null
    });
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...userData });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Загрузка данных пользователя (заглушка)
    useEffect(() => {
        // В реальном приложении здесь будет запрос к API
        const loadUserData = async () => {
            setIsLoading(true);
            try {
                // Имитация загрузки данных
                setTimeout(() => {
                    setUserData({
                        firstName: 'Иван',
                        lastName: 'Иванов',
                        email: 'ivan@example.com',
                        phone: '+7 (999) 123-45-67',
                        avatar: null
                    });
                    setFormData({
                        firstName: 'Иван',
                        lastName: 'Иванов',
                        email: 'ivan@example.com',
                        phone: '+7 (999) 123-45-67',
                        avatar: null
                    });
                    
                    // Загрузка заказов
                    setOrders([
                        {
                            id: 1,
                            date: '2024-01-15',
                            total: 45900,
                            status: 'delivered',
                            items: [
                                { name: "Кухонный гарнитур 'Милена'", quantity: 1, price: 45900 }
                            ]
                        },
                        {
                            id: 2,
                            date: '2024-01-10',
                            total: 15700,
                            status: 'processing',
                            items: [
                                { name: "Шкаф нижний 'Под яды'", quantity: 1, price: 15700 }
                            ]
                        }
                    ]);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error loading user data:', error);
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!formData.phone.trim()) {
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
            // Имитация сохранения на сервере
            setTimeout(() => {
                setUserData({ ...formData });
                setIsEditing(false);
                setIsLoading(false);
                alert('Профиль успешно обновлен!');
            }, 1000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({ ...userData });
        setIsEditing(false);
        setErrors({});
    };

    const getStatusText = (status) => {
        const statusMap = {
            'processing': 'В обработке',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            'processing': styles.statusProcessing,
            'shipped': styles.statusShipped,
            'delivered': styles.statusDelivered,
            'cancelled': styles.statusCancelled
        };
        return classMap[status] || '';
    };

    if (isLoading && !userData.firstName) {
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

    return (
        <div className={styles.container}>
            <Header />
            
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.profileHeader}>
                        <h1 className={styles.title}>Личный кабинет</h1>
                        <p className={styles.subtitle}>Управление вашим профилем и заказами</p>
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
                                    📦 Корзина
                                </button>
                                <button 
                                    className={`${styles.navItem} ${activeTab === 'security' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    🔐 Безопасность
                                </button>
                                <button 
                                    className={`${styles.navItem} ${styles.logout}`}
                                    onClick={() => alert('Выход из системы')}
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
                                        <div className={styles.avatarSection}>
                                            <div className={styles.avatar}>
                                                <img 
                                                    src={formData.avatar || '/default-avatar.png'} 
                                                    alt="Аватар"
                                                    className={styles.avatarImage}
                                                />
                                                {isEditing && (
                                                    <label className={styles.avatarUpload}>
                                                        📷
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                            className={styles.avatarInput}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Имя *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
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
                                                    value={formData.lastName}
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
                                                    value={formData.email}
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
                                                    value={formData.phone}
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

                                    <div className={styles.securitySection}>
                                        <h3>Двухфакторная аутентификация</h3>
                                        <div className={styles.twoFactor}>
                                            <p>Добавьте дополнительный уровень безопасности к вашему аккаунту</p>
                                            <button className={styles.secondaryButton}>
                                                Включить 2FA
                                            </button>
                                        </div>
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