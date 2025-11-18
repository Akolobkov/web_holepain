import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useProductDetails } from '../hooks/useProductDetails';
import styles from './Details.module.css';

function Details() {
    const { id } = useParams();
    const { product, loading, error } = useProductDetails(id);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!product) return;
        
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        alert(`Товар "${product.title}" (${quantity} шт.) добавлен в корзину!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        alert(`Переход к оформлению заказа: ${product.title} (${quantity} шт.)`);
    };

    const handleQuantityChange = (value) => {
        const newQuantity = Math.max(1, Math.min(10, value));
        setQuantity(newQuantity);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.content}>
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Загрузка информации о товаре...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.content}>
                        <div className={styles.error}>
                            <h3>Товар не найден</h3>
                            <p>{error}</p>
                            <Link to="/catalog" className={styles.breadcrumbLink}>
                                Вернуться в каталог
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            
            <main className={styles.main}>
                <div className={styles.content}>
                    {/* Хлебные крошки */}
                    <nav className={styles.breadcrumbs}>
                        <Link to="/" className={styles.breadcrumbLink}>Главная</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <Link to="/catalog" className={styles.breadcrumbLink}>Каталог</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.currentPage}>{product.title}</span>
                    </nav>

                    {/* Основная информация о товаре */}
                    <div className={styles.productDetails}>
                        <div className={styles.mainSection}>
                            {/* Галерея изображений */}

                            <div className={styles.gallery}>
                                <div className={styles.sliderWithPreview}>
                                {/* Основной слайдер */}
                                <div className={styles.mainSlider}>
                                <div 
                                className={styles.slides}
                                style={{ transform: `translateX(-${selectedImage * 100}%)` }}
                >
                {product.images.map((image, index) => (
                    <div key={image.id || index} className={styles.slide}>
                        <img 
                            src={image.url} 
                            alt={`${product.title} ${index + 1}`}
                            className={styles.productImage}
                        />
                    </div>
                ))}
            </div>
            
            {/* Кнопки навигации */}
            {product.images.length > 1 && (
                <>
                    <button 
                        className={styles.navButton}
                        onClick={() => setSelectedImage(prev => 
                            prev === 0 ? product.images.length - 1 : prev - 1
                        )}
                    >
                        ←
                    </button>
                    <button 
                        className={styles.navButton}
                        onClick={() => setSelectedImage(prev => 
                            prev === product.images.length - 1 ? 0 : prev + 1
                        )}
                    >
                        →
                    </button>
                </>
            )}
        </div>
        
        {/* Превью миниатюры */}
        {product.images.length > 1 && (
            <div className={styles.previewStrip}>
                {product.images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className={`${styles.previewItem} ${
                            selectedImage === index ? styles.active : ''
                        }`}
                        onClick={() => setSelectedImage(index)}
                    >
                        <img 
                            src={image.url} 
                            alt={`Превью ${index + 1}`}
                            className={styles.previewImage}
                        />
                    </div>
                ))}
            </div>
        )}
    </div>
</div>

                            {/* Информация о товаре */}
                            <div className={styles.productInfo}>
                                <div className={styles.productHeader}>
                                    <h1 className={styles.productTitle}>{product.title}</h1>
                                    <div className={styles.productSku}>Артикул: {product.id}</div>
                                </div>

                                {/* Цена */}
                                <div className={styles.priceSection}>
                                    <div className={styles.currentPrice}>
                                        {product.price.toLocaleString('ru-RU')} ₽
                                    </div>
                                </div>

                                {/* Статус и доставка */}
                                <div className={styles.statusSection}>
                                    <div className={`${styles.stockStatus} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                                        {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                                    </div>
                                    <div className={styles.deliveryInfo}>
                                        {product.fastDelivery && <span>🚚 Быстрая доставка</span>}
                                        <span>Гарантия: {product.warranty}</span>
                                    </div>
                                </div>

                                {/* Кнопки действий */}
                                <div className={styles.actionsSection}>
                                    <div className={styles.quantitySelector}>
                                        <span className={styles.quantityLabel}>Количество:</span>
                                        <div className={styles.quantityControls}>
                                            <button 
                                                className={styles.quantityButton}
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="number"
                                                className={styles.quantityInput}
                                                value={quantity}
                                                min="1"
                                                max="10"
                                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                            />
                                            <button 
                                                className={styles.quantityButton}
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                                disabled={quantity >= 10}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.actionButtons}>
                                        <button 
                                            className={styles.primaryButton}
                                            onClick={handleBuyNow}
                                            disabled={!product.inStock}
                                        >
                                            Купить сейчас
                                        </button>
                                        <button 
                                            className={styles.secondaryButton}
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                        >
                                            В корзину
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Детальная информация */}
                        <div className={styles.detailsSection}>
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Описание товара</h2>
                                <p className={styles.description}>{product.fullDescription}</p>
                            </div>

                            {product.features && product.features.length > 0 && (
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Особенности</h2>
                                    <div className={styles.featuresList}>
                                        {product.features.map((feature, index) => (
                                            <div key={index} className={styles.featureItem}>
                                                <span className={styles.featureIcon}>✓</span>
                                                <span className={styles.featureText}>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.specifications && product.specifications.length > 0 && (
                                <div className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Характеристики</h2>
                                    <div className={styles.specifications}>
                                        {product.specifications.map((spec, index) => (
                                            <div key={index} className={styles.specRow}>
                                                <span className={styles.specName}>{spec.name}</span>
                                                <span className={styles.specValue}>{spec.value}</span>
                                            </div>
                                        ))}
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

export default Details;