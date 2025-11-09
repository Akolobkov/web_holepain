import Card from './Card.jsx';
import styles from './Row.module.css';

function Row({ 
    title, 
    products, 
    onProductDetails, 
    onAddToCart,
    showViewAll = true 
}) {
    const handleViewAll = () => {
        console.log(`View all products from: ${title}`);
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className={styles.row}>
            <div className={styles.rowHeader}>
                <h2 className={styles.rowTitle}>{title}</h2>
                {showViewAll}
            </div>
            
            <div className={styles.cardsContainer}>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        product={product}
                        onDetailsClick={onProductDetails}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </section>
    );
}

export default Row;