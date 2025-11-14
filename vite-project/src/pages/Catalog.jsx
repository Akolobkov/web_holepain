// Catalog.jsx
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Row from './Row.jsx';
import { useProducts } from '../hooks/cataloghook.js';
import styles from './Catalog.module.css';

function Catalog() {
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();

    const handleProductDetails = (product) => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (product) => {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        alert(`Товар "${product.title}" добавлен в корзину!`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка товаров с сервера...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.error}>
                    <h3>Ошибка загрузки данных</h3>
                    <p>{error}</p>
                    <p>Проверьте, запущен ли сервер на порту 300</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className={styles.retryButton}
                    >
                        Попробовать снова
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
                    <section className={styles.hero}>
                        <h1 className={styles.mainTitle}>Каталог мебели</h1>
                        <p className={styles.subtitle}>
                            Широкий выбор качественной мебели для дома и офиса по доступным ценам
                        </p>
                    </section>

                    <div className={styles.catalogGrid}>
                        {products.kitchens.length > 0 && (
                            <Row
                                title="Кухни"
                                products={products.kitchens}
                                onProductDetails={handleProductDetails}
                                onAddToCart={handleAddToCart}
                            />
                        )}
                        
                        {products.bedrooms.length > 0 && (
                            <Row
                                title="Спальни"
                                products={products.bedrooms}
                                onProductDetails={handleProductDetails}
                                onAddToCart={handleAddToCart}
                            />
                        )}
                        
                        {products.gostinniye.length > 0 && (
                            <Row
                                title="Гостиные"
                                products={products.gostinniye}
                                onProductDetails={handleProductDetails}
                                onAddToCart={handleAddToCart}
                            />
                        )}
                    </div>

                    {!products.kitchens.length && !products.bedrooms.length && !products.gostinniye.length && (
                        <div className={styles.empty}>
                            <h3>Товары не найдены</h3>
                            <p>В данный момент в каталоге нет доступных товаров.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Catalog;