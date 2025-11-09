import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './Details.module.css';

// Импорты изображений
import Kuhgar from '../img/Kuhgar.webp';
import Modkuh from '../img/Modkuh.webp';
import kuhmod from '../img/kuhmod.webp';
import stol from '../img/stol.jpg';
import ModSpal from '../img/Modspal.webp';
import krovati from '../img/krovati.webp';
import gost from '../img/gost.webp';

// Mock данные товаров
const mockProducts = {
    1: {
        id: 1,
        title: "Кухонный гарнитур 'Милена'",
        description: "Цвет материала фасада: белый арт, Цвет материала корпуса: белый",
        fullDescription: "Стильный кухонный гарнитур 'Милена' выполнен в классическом белом цвете. Идеальное решение для современной кухни. Качественные материалы и продуманная эргономика делают эту кухню практичной и удобной в использовании.",
        price: 45900,
        images: [Kuhgar, Kuhgar, Kuhgar], // Можно добавить разные изображения
        features: [
            "Фасад: белый арт",
            "Корпус: белый",
            "Столешница: влагостойкая",
            "Фурнитура: Blum",
            "Гарантия: 2 года"
        ],
        specifications: [
            { name: "Ширина", value: "280 см" },
            { name: "Глубина", value: "60 см" },
            { name: "Высота", value: "220 см" },
            { name: "Материал фасада", value: "ЛДСП" },
            { name: "Материал корпуса", value: "ЛДСП" },
            { name: "Страна производства", value: "Россия" }
        ],
        inStock: true,
        fastDelivery: true,
        warranty: "24 месяца"
    },
    2: {
        id: 2,
        title: "Модульная кухня 'Олива Глянец'",
        description: "Цвет материала фасада: олива, Цвет материала корпуса: белый",
        fullDescription: "Современная модульная кухня в стиле глянец с элегантным оливковым цветом. Модульная система позволяет адаптировать кухню под любое помещение.",
        price: 128900,
        images: [Modkuh, Modkuh, Modkuh],
        features: [
            "Фасад: олива глянец",
            "Корпус: белый",
            "Модульная система",
            "Современный дизайн",
            "Легкость в уходе"
        ],
        specifications: [
            { name: "Тип", value: "Модульная" },
            { name: "Цвет", value: "Олива глянец" },
            { name: "Материал", value: "МДФ" },
            { name: "Покрытие", value: "Глянцевое" }
        ],
        inStock: true,
        fastDelivery: true,
        warranty: "36 месяцев"
    },
    3: {
        id: 3,
        title: "Шкаф нижний 'Под яды'",
        description: "МаоМао бы одобрила, Цвет материала фасада: дерево",
        fullDescription: "Практичный нижний шкаф для кухни. Идеальное решение для хранения кухонной утвари и продуктов. Качественная фурнитура обеспечивает долгий срок службы.",
        price: 15700,
        images: [kuhmod, kuhmod, kuhmod],
        features: [
            "Фасад: дерево",
            "Вместительный",
            "Качественная фурнитура",
            "Легкий монтаж"
        ],
        specifications: [
            { name: "Ширина", value: "80 см" },
            { name: "Глубина", value: "60 см" },
            { name: "Высота", value: "85 см" },
            { name: "Количество полок", value: "2" }
        ],
        inStock: true,
        fastDelivery: false,
        warranty: "12 месяцев"
    },
    4: {
        id: 4,
        title: "Столешница 2,9м",
        description: "Цвет материала корпуса: семолина",
        fullDescription: "Прочная и долговечная столешница длиной 2,9 метра. Устойчива к влаге и механическим повреждениям. Идеально подходит для кухонных гарнитуров.",
        price: 100,
        images: [stol, stol, stol],
        features: [
            "Длина: 2,9 м",
            "Цвет: семолина",
            "Влагостойкая",
            "Устойчива к повреждениям"
        ],
        specifications: [
            { name: "Длина", value: "290 см" },
            { name: "Глубина", value: "60 см" },
            { name: "Толщина", value: "28 мм" },
            { name: "Материал", value: "ЛДСП" }
        ],
        inStock: true,
        fastDelivery: true,
        warranty: "12 месяцев"
    },
    5: {
        id: 5,
        title: "Модульная спальня 'Венеция'",
        description: "Цвет материала фасада: жемчуг, Цвет материала корпуса: белый",
        fullDescription: "Элегантная модульная спальня в стиле 'Венеция'. Нежный жемчужный цвет создает атмосферу уюта и гармонии в спальне.",
        price: 223400,
        images: [ModSpal, ModSpal, ModSpal],
        features: [
            "Фасад: жемчуг",
            "Корпус: белый",
            "Модульная система",
            "Вместительные шкафы",
            "Элегантный дизайн"
        ],
        specifications: [
            { name: "Комплектация", value: "Шкаф, комод, тумбы" },
            { name: "Цвет", value: "Жемчуг/белый" },
            { name: "Материал", value: "ЛДСП" },
            { name: "Стиль", value: "Современный" }
        ],
        inStock: true,
        fastDelivery: true,
        warranty: "24 месяца"
    },
    6: {
        id: 6,
        title: "Кровать Ронда КР-140 с основанием ЛДСП",
        description: "Цвет материала фасада: белое дерево, Цвет материала корпуса: белое дерево",
        fullDescription: "Компактная и удобная кровать Ронда КР-140. Ортопедическое основание обеспечивает комфортный сон. Стильный дизайн в цвете белое дерево.",
        price: 10900,
        images: [krovati, krovati, krovati],
        features: [
            "Размер: 140 см",
            "Цвет: белое дерево",
            "Ортопедическое основание",
            "Простая сборка"
        ],
        specifications: [
            { name: "Ширина", value: "140 см" },
            { name: "Длина", value: "200 см" },
            { name: "Высота", value: "90 см" },
            { name: "Материал", value: "ЛДСП" }
        ],
        inStock: true,
        fastDelivery: true,
        warranty: "18 месяцев"
    },
    7: {
        id: 7,
        title: "Комплект гостиной Николь",
        description: "Цвет материала фасада: софт айвори, Цвет материала корпуса: дуб крафт серый",
        fullDescription: "Роскошный комплект гостиной 'Николь' сочетает в себе нежный цвет софт айвори и благородный дуб крафт серый. Идеальное решение для просторной гостиной.",
        price: 129000,
        images: [gost, gost, gost],
        features: [
            "Фасад: софт айвори",
            "Корпус: дуб крафт серый",
            "Вместительные секции",
            "Стильный дизайн",
            "Качественная сборка"
        ],
        specifications: [
            { name: "Комплектация", value: "Диван, шкафы, полки" },
            { name: "Общая длина", value: "420 см" },
            { name: "Высота", value: "220 см" },
            { name: "Материал", value: "ЛДСП" }
        ],
        inStock: true,
        fastDelivery: true,
        warranty: "24 месяца"
    }
};

function Details() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const product = mockProducts[id];

    if (!product) {
        return (
            <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.content}>
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <h2>Товар не найден</h2>
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

    const handleAddToCart = () => {
        alert(`Товар "${product.title}" (${quantity} шт.) добавлен в корзину!`);
    };

    const handleBuyNow = () => {
        alert(`Переход к оформлению заказа: ${product.title} (${quantity} шт.)`);
    };

    const handleQuantityChange = (value) => {
        const newQuantity = Math.max(1, Math.min(10, value));
        setQuantity(newQuantity);
    };

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
                        <span>{product.title}</span>
                    </nav>

                    {/* Основная информация о товаре */}
                    <div className={styles.productDetails}>
                        <div className={styles.mainSection}>
                            {/* Галерея изображений */}
                            <div className={styles.gallery}>
                                <div className={styles.mainImage}>
                                    <img 
                                        src={product.images[selectedImage]} 
                                        alt={product.title}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Нет+изображения';
                                        }}
                                    />
                                </div>
                                <div className={styles.thumbnailContainer}>
                                    {product.images.map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${product.title} ${index + 1}`}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=Нет+фото';
                                                }}
                                            />
                                        </div>
                                    ))}
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
                                    {product.fastDelivery && (
                                        <div className={styles.deliveryInfo}>
                                            <span>🚚 Быстрая доставка</span>
                                            <span>•</span>
                                            <span>Гарантия: {product.warranty}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Кнопки действий */}
                                <div className={styles.actionsSection}>
                                    <div className={styles.quantitySelector}>
                                        <span className={styles.quantityLabel}>Количество:</span>
                                        <div className={styles.quantityControls}>
                                            <button 
                                                className={styles.quantityButton}
                                                onClick={() => handleQuantityChange(quantity - 1)}
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
                            <h2 className={styles.sectionTitle}>Описание товара</h2>
                            <p className={styles.description}>{product.fullDescription}</p>

                            <h2 className={styles.sectionTitle}>Особенности</h2>
                            <div className={styles.featuresList}>
                                {product.features.map((feature, index) => (
                                    <div key={index} className={styles.featureItem}>
                                        <span className={styles.featureIcon}>✓</span>
                                        <span className={styles.featureText}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <h2 className={styles.sectionTitle}>Характеристики</h2>
                            <table className={styles.specifications}>
                                <tbody>
                                    {product.specifications.map((spec, index) => (
                                        <tr key={index}>
                                            <td>{spec.name}</td>
                                            <td>{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Details;