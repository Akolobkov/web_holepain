import { useState } from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './Auth.module.css';
import UserAgreement from "./userAgreement.jsx";
function Auth() {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAgreement, setShowAgreement] = useState(false); 
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrors({});
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            rememberMe: false
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
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
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
        }
        if (!formData.agreeToTerms) {
                newErrors.agreeToTerms = 'Необходимо согласие с пользовательским соглашением';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        // Имитация запроса к серверу
        setTimeout(() => {
            alert(activeTab === 'login' ? 'Успешный вход!' : 'Регистрация успешна!');
            setIsSubmitting(false);
            
            // Сброс формы после успешной отправки
            if (activeTab === 'register') {
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    rememberMe: false
                });
            }
        }, 1500);
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

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {activeTab === 'register' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Имя</label>
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
                                <label className={styles.label}>Email</label>
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
                                <label className={styles.label}>Пароль</label>
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
                                    <label className={styles.label}>Подтверждение пароля</label>
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
                                    <a href="/user-agreement" 
                                    className={styles.termsLink}
                                    target="_blank" // открывает в новой вкладке
                                    rel="noopener noreferrer"
                                    >
                                    пользовательским соглашением
                                    </a>
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
        </div>
    );
}

export default Auth;