import { useState } from 'react';
import styles from './Card.module.css';

function Card({ product, onDetailsClick, onAddToCart }) {
    const {
        id,
        title,
        description,
        price,
        image,
        features = [],
        badge
    } = product;

    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState('');

    const handleDetailsClick = () => {
        if (onDetailsClick) {
            onDetailsClick(product);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setAddError('');

        // Проверяем авторизацию
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
            return;
        }

        setIsAdding(true);

        try {
            const response = await fetch(`http://localhost:300/api/cart/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: id,
                    quantity: 1
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Вызываем callback если передан
                if (onAddToCart) {
                    onAddToCart(product);
                }
                
                // Показываем уведомление
                showAddToCartNotification();
            } else {
                setAddError(data.error || 'Ошибка при добавлении в корзину');
                alert('Ошибка: ' + (data.error || 'Не удалось добавить товар в корзину'));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setAddError('Ошибка сети');
            alert('Ошибка сети при добавлении в корзину');
        } finally {
            setIsAdding(false);
        }
    };

    const showAddToCartNotification = () => {
        
        const notification = document.createElement('div');
        notification.className = styles.addNotification;
        notification.textContent = 'Товар добавлен в корзину!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    };

    const handleBuyNow = async (e) => {
        e.stopPropagation();
        
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            alert('Пожалуйста, войдите в систему чтобы совершить покупку');
            return;
        }

        setIsAdding(true);

        try {
            const response = await fetch(`http://localhost:300/api/cart/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: id,
                    quantity: 1
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Переходим в корзину
                window.location.href = `/profile/${user.id}?tab=orders`;
            } else {
                alert('Ошибка: ' + (data.error || 'Не удалось добавить товар в корзину'));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Ошибка сети при добавлении в корзину');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className={styles.card} onClick={handleDetailsClick}>
            {badge && <div className={styles.cardBadge}>{badge}</div>}
            
            <img 
                src={image} 
                alt={title}
                className={styles.cardImage}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
            />
            
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
                
                {features.length > 0 && (
                    <div className={styles.cardFeatures}>
                        {features.slice(0, 2).map((feature, index) => (
                            <span key={index} className={styles.feature}>
                                ✓ {feature}
                            </span>
                        ))}
                        {features.length > 2 && (
                            <span className={styles.moreFeatures}>
                                +{features.length - 2} ещё
                            </span>
                        )}
                    </div>
                )}
                
                <div className={styles.cardPrice}>
                    {price.toLocaleString('ru-RU')} ₽
                </div>
                
                <div className={styles.cardActions}>
                    <button 
                        className={`${styles.cardButton} ${styles.secondaryButton}`}
                        onClick={handleDetailsClick}
                    >
                        Подробнее
                    </button>
                    
                    <div className={styles.primaryActions}>
                        <button 
                            className={`${styles.cardButton} ${styles.primaryButton}`}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                        >
                            {isAdding ? (
                                <span className={styles.loadingText}>
                                    <span className={styles.spinner}></span>
                                    Добавляем...
                                </span>
                            ) : (
                                'В корзину'
                            )}
                        </button>
                    </div>
                </div>

                {addError && (
                    <div className={styles.errorMessage}>
                        {addError}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;