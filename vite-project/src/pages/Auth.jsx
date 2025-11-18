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
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (authError) {
            setAuthError('');
        }
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
        console.log('📤 Sending registration request:', userData);
        
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            }),
        });

        console.log('📥 Response status:', response.status);
        
        // Проверяем, есть ли контент
        const responseText = await response.text();
        console.log('📥 Response text:', responseText);

        if (!responseText) {
            throw new Error('Пустой ответ от сервера');
        }

        const data = JSON.parse(responseText);
        console.log('📥 Parsed data:', data);

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error('❌ Registration error:', error);
        return { success: false, error: error.message };
    }
};

const handleLogin = async (email, password) => {
    try {
        console.log('📤 Sending login request:', { email });
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('📥 Response status:', response.status);
        
        const responseText = await response.text();
        console.log('📥 Response text:', responseText);

        if (!responseText) {
            throw new Error('Пустой ответ от сервера');
        }

        const data = JSON.parse(responseText);
        console.log('📥 Parsed data:', data);

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error('❌ Login error:', error);
        return { success: false, error: error.message };
    }
};
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

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
                // Сохраняем пользователя в localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Показываем успешное сообщение
                alert(activeTab === 'login' ? 'Успешный вход!' : 'Регистрация успешна!');
                
                // Перенаправляем на главную страницу
                navigate('/');
                
                // Сброс формы после успешной отправки
                if (activeTab === 'register') {
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
                }
            } else {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError('Произошла ошибка при выполнении запроса');
            console.error('Auth error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenAgreement = () => {
        setShowAgreement(true);
    };

    const handleCloseAgreement = () => {
        setShowAgreement(false);
    };

    const handleAgreeToTerms = () => {
        setFormData(prev => ({
            ...prev,
            agreeToTerms: true
        }));
        setShowAgreement(false);
    };

    const handleSocialLogin = (provider) => {
        alert(`Вход через ${provider} (заглушка)`);
    };

    // Функция для форматирования телефона
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.startsWith('7') || numbers.startsWith('8')) {
            return '+7 (' + numbers.substring(1, 4) + ') ' + numbers.substring(4, 7) + '-' + numbers.substring(7, 9) + '-' + numbers.substring(9, 11);
        }
        return value;
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhone(e.target.value);
        setFormData(prev => ({
            ...prev,
            phone: formattedPhone
        }));
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

                        {/* Общая ошибка авторизации */}
                        {authError && (
                            <div className={styles.authError}>
                                {authError}
                            </div>
                        )}

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
                                <label className={styles.label}>Номер телефона *</label>
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
                                    <a href="#forgot" className={styles.forgotLink}>
                                        Забыли пароль?
                                    </a>
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
                                        <span>
                                            Я согласен с {' '}
                                            <button 
                                                type="button"
                                                className={styles.termsLink}
                                                onClick={handleOpenAgreement}
                                            >
                                                пользовательским соглашением
                                            </button>
                                        </span>
                                    </label>
                                    {errors.agreeToTerms && (
                                        <span className={styles.errorText}>{errors.agreeToTerms}</span>
                                    )}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Загрузка...' : (activeTab === 'login' ? 'Войти' : 'Зарегистрироваться')}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>или</span>
                        </div>

                        <div className={styles.socialButtons}>
                            <button 
                                className={`${styles.socialButton} ${styles.google}`}
                                onClick={() => handleSocialLogin('Yandex')}
                                type="button"
                            >
                                Яндекс
                            </button>
                            <button 
                                className={`${styles.socialButton} ${styles.facebook}`}
                                onClick={() => handleSocialLogin('Max_idi_nahui')}
                                type="button"
                            >
                                Мессенджер Макс
                            </button>
                        </div>

                        <div className={styles.bottomText}>
                            {activeTab === 'login' ? (
                                <>
                                    Нет аккаунта? 
                                    <button 
                                        className={styles.link}
                                        onClick={() => handleTabChange('register')}
                                        type="button"
                                    >
                                        Зарегистрироваться
                                    </button>
                                </>
                            ) : (
                                <>
                                    Уже есть аккаунт? 
                                    <button 
                                        className={styles.link}
                                        onClick={() => handleTabChange('login')}
                                        type="button"
                                    >
                                        Войти
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Модальное окно пользовательского соглашения */}
            {showAgreement && (
                <UserAgreement 
                    onClose={handleCloseAgreement}
                    onAgree={handleAgreeToTerms}
                />
            )}
        </div>
    );
}

export default Auth;