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

    const handleDetailsClick = () => {
        if (onDetailsClick) {
            onDetailsClick(product);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
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
                    <button 
                        className={`${styles.cardButton} ${styles.primaryButton}`}
                        onClick={handleAddToCart}
                    >
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;