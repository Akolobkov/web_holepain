import { useNavigate } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Row from './Row.jsx';
import styles from './Catalog.module.css';
import Kuhgar from '../img/Kuhgar.webp'
import Modkuh from '../img/Modkuh.webp'
import kuhmod from '../img/kuhmod.webp'
import stol from '../img/stol.jpg'
import ModSpal from '../img/ModSpal.webp'
import krovati from '../img/krovati.webp'
import gost from '../img/gost.webp'
const mockProducts = {
    kitchens: [
        {
            id: 1,
            title: "Кухонный гарнитур 'Милена'",
            description: "Цвет материала фасада: белый арт, Цвет материала корпуса: белый",
            price: 45900,
            image: Kuhgar,
        },
        {
            id: 2,
            title: "Модульная кухня 'Олива Глянец'",
            description: "Цвет материала фасада: олива, Цвет материала корпуса: белый",
            price: 128900,
            image: Modkuh,
        },
        {
            id: 3,
            title: "Шкаф нижний 'Под яды'",
            description: "МаоМао бы одобрила, Цвет материала фасада: дерево",
            price: 15700,
            image: kuhmod
        },
        {
            id: 4,
            title: "Столешница 2,9м",
            description: "Цвет материала корпуса: семолина",
            price: 100,
            image: stol,
        }
    ],
    bedrooms: [
        {
            id: 5,
            title: "Модульная спальня 'Венеция'",
            description: "Цвет материала фасада: жемчуг, Цвет материала корпуса: белый",
            price: 223400,
            image: ModSpal,
        },
        {
            id: 6,
            title: "Кровать Ронда КР-140 с основанием ЛДСП",
            description: "Цвет материала фасада: белое дерево, Цвет материала корпуса: белое дерево",
            price: 10900,
            image: krovati
        }
    ],
    gostinniye: [
        {
            id: 7,
            title: "Комплект гостиной Николь",
            description: "Цвет материала фасада: софт айвори, Цвет материала корпуса: дуб крафт серый",
            price: 129000,
            image: gost,
        }
    ]
};

function Catalog() {
    const navigate = useNavigate();
    const handleProductDetails = (product) => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (product) => {
        alert(`Товар "${product.title}" добавлен в корзину!`);
    };

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
                        <Row
                            title="Кухни"
                            products={mockProducts.kitchens}
                            onProductDetails={handleProductDetails}
                            onAddToCart={handleAddToCart}
                        />
                        
                        <Row
                            title="Спальни"
                            products={mockProducts.bedrooms}
                            onProductDetails={handleProductDetails}
                            onAddToCart={handleAddToCart}
                        />
                        
                        <Row
                            title="Гостиные"
                            products={mockProducts.gostinniye}
                            onProductDetails={handleProductDetails}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Catalog;