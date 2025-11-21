import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from "./Header.module.css";
import Button from "./Button";
import Logo from '../img/logo.png';
import userIcon from '../img/userIcon.jpg';
import enterImg from '../img/enter-icon.png'; 

function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Проверяем авторизацию при загрузке и при изменениях
    useEffect(() => {
        checkAuthStatus();
        
        // Слушаем изменения в localStorage
        window.addEventListener('storage', checkAuthStatus);
        
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const checkAuthStatus = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                logout();
            }
        } else {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    const handleProfileClick = () => {
        if (user && user.id) {
            navigate(`/profile/${user.id}`);
        } else {
            navigate('/login');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        setUser(null);
        setIsLoggedIn(false);
        navigate('/');
        alert('Вы вышли из системы');
    };

    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            logout();
        }
    };

    return (
        <header className={styles.header}>
            <img src={Logo} alt='logo' height={'70px'} onClick={() => navigate('/')} style={{cursor: 'pointer'}} />

            <nav className={styles.block1}>
                <Button text="Главная страница" to="/" />
                <Button text="Каталог" to="/catalog" />
                <Button text="О нас" to="/about" />
                <Button text="Контактная информация" to="/contactinfo" />
            </nav>

            <div className={styles.block2}>
                {isLoggedIn && user ? (
                    <div className={styles.userMenu}>
                        <button 
                            className={styles.userButton}
                            onClick={handleProfileClick}
                            title={`${user.firstName} ${user.lastName || ''}`}
                        >
                            <img 
                                src={userIcon} 
                                alt="Профиль" 
                                className={styles.userIcon}
                            />
                            <span className={styles.userName}>
                                {user.firstName}
                            </span>
                        </button>
                        <button 
                            className={styles.logoutButton}
                            onClick={handleLogout}
                            title="Выйти"
                        >
                            🚪
                        </button>
                    </div>
                ) : (
                    <button 
                        className={styles.loginButton}
                        onClick={handleLoginClick}
                        title="Войти в систему"
                    >
                        <img 
                            src={enterImg} 
                            alt="Войти" 
                            className={styles.loginIcon}
                        />
                        <span>Войти</span>
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;