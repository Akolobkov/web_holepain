import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './Auth.module.css';
import UserAgreement from "./userAgreement.jsx";

function Auth() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        rememberMe: false,
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAgreement, setShowAgreement] = useState(false);
    const [authError, setAuthError] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrors({});
        setAuthError('');
        setFormData({
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            rememberMe: false,
            agreeToTerms: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (authError) setAuthError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!formData.phone) {
            newErrors.phone = 'Номер телефона обязателен';
        } else if (!/^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(formData.phone)) {
            newErrors.phone = 'Некорректный номер телефона';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (activeTab === 'register') {
            if (!formData.firstName) {
                newErrors.firstName = 'Имя обязательно';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Подтверждение пароля обязательно';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Пароли не совпадают';
            }
            if (!formData.agreeToTerms) {
                newErrors.agreeToTerms = 'Необходимо согласие с пользовательским соглашением';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (userData) => {
        try {
            const response = await fetch('http://localhost:300/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                }),
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка регистрации');
            }

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await fetch('http://localhost:300/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthError('');

    try {
        let result;
        if (activeTab === 'login') {
            result = await handleLogin(formData.email, formData.password);
        } else {
            result = await handleRegister(formData);
        }

        if (result.success) {
            // Сохраняем пользователя
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            console.log('✅ Auth successful, user saved:', result.user);
            
            // Показываем сообщение и редирект
            alert(activeTab === 'login' ? 'Успешный вход!' : 'Регистрация успешна!');
            
            // Редирект на профиль или главную
            navigate(`/profile/${result.user.id}`);
        } else {
            setAuthError(result.error);
        }
    } catch (error) {
        setAuthError('Ошибка сети. Проверьте подключение к серверу.');
    } finally {
        setIsSubmitting(false);
    }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = value;
        
        if (value.startsWith('7') || value.startsWith('8')) {
            formattedValue = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
        
        setFormData(prev => ({ ...prev, phone: formattedValue }));
        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            
            <main className={styles.mainContent}>
                <div className={styles.authContainer}>
                    <div className={styles.authCard}>
                        <div className={styles.tabs}>
                            <button 
                                className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
                                onClick={() => handleTabChange('login')}
                            >
                                Вход
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
                                onClick={() => handleTabChange('register')}
                            >
                                Регистрация
                            </button>
                        </div>

                        <h2 className={styles.title}>
                            {activeTab === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
                        </h2>

                        {authError && <div className={styles.authError}>{authError}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {activeTab === 'register' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Имя *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
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
                                            placeholder="Введите вашу фамилию"
                                        />
                                    </div>
                                </>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
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
                                    onChange={handlePhoneChange}
                                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                                    placeholder="+7 (999) 123-45-67"
                                />
                                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Пароль *</label>
                                <div className={styles.passwordInput}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${errors.password ? styles.error : ''}`}
                                        placeholder="Введите пароль"
                                    />
                                    <button 
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                            </div>

                            {activeTab === 'register' && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Подтверждение пароля *</label>
                                    <div className={styles.passwordInput}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                                            placeholder="Повторите пароль"
                                        />
                                        <button 
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                                </div>
                            )}

                            {activeTab === 'login' && (
                                <div className={styles.rememberForgot}>
                                    <label className={styles.remember}>
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleInputChange}
                                            className={styles.checkbox}
                                        />
                                        Запомнить меня
                                    </label>
                                    <a href="#forgot" className={styles.forgotLink}>Забыли пароль?</a>
                                </div>
                            )}

                            {activeTab === 'register' && (
                                <div className={styles.termsGroup}>
                                    <label className={styles.termsLabel}>
                                        <input
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleInputChange}
                                            className={`${styles.checkbox} ${errors.agreeToTerms ? styles.error : ''}`}
                                        />
                                        <span>Я согласен с <button type="button" className={styles.termsLink} onClick={() => window.open('/userAgreement', '_blank')}>пользовательским соглашением</button></span>
                                    </label>
                                    {errors.agreeToTerms && <span className={styles.errorText}>{errors.agreeToTerms}</span>}
                                </div>
                            )}

                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? 'Загрузка...' : (activeTab === 'login' ? 'Войти' : 'Зарегистрироваться')}
                            </button>
                        </form>

                        <div className={styles.divider}><span>или</span></div>

                        <div className={styles.socialButtons}>
                            <button className={`${styles.socialButton} ${styles.google}`} onClick={() => alert('Яндекс (заглушка)')}>Яндекс</button>
                            <button className={`${styles.socialButton} ${styles.facebook}`} onClick={() => alert('Мессенджер Макс (заглушка)')}>Мессенджер Макс</button>
                        </div>

                        <div className={styles.bottomText}>
                            {activeTab === 'login' ? (
                                <>Нет аккаунта? <button className={styles.link} onClick={() => handleTabChange('register')}>Зарегистрироваться</button></>
                            ) : (
                                <>Уже есть аккаунт? <button className={styles.link} onClick={() => handleTabChange('login')}>Войти</button></>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            {showAgreement && <UserAgreement onClose={() => setShowAgreement(false)} onAgree={() => { setFormData(prev => ({...prev, agreeToTerms: true})); setShowAgreement(false); }} />}
        </div>
    );
}

export default Auth;