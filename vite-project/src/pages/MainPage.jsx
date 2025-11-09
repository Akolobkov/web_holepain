import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './MainPage.module.css';
import origImg from '../img/orig.png';

function MainPage() {
    return (
        <div className={styles.container}>
            <Header />
            
            <main className={styles.main}>
                <div className={styles.content}>
                    <section className={styles.hero}>
                        <h1 className={styles.mainTitle}>
                            <a 
                                href="https://interior-center.ru/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.titleLink}
                            >
                                Продажа мебели
                            </a>
                        </h1>
                        <div className={styles.intro}>
                            <div className={styles.slogan}>
                                    <h2>Интерьер-Центр</h2>
                                    <p>Мебель для комфортной жизни</p>
                            </div>
                            <div className={styles.introText}>
                                <p>
                                    Производим мебель, которая сочетает в себе эстетику и практичность. 
                                    Наши коллекции – это результат продуманного выбора дизайна, цвета, 
                                    текстуры, деталей и функциональных механизмов, которые вместе создают 
                                    пространство гармонии и комфорта.
                                </p>
                                <p>
                                    Опираясь на многолетний опыт и применяя передовые технологии, 
                                    мы выпускаем продукцию, соответствующую всем стандартам качества.
                                </p>
                            </div>
                        </div>
                        
                    </section>
                <div className={styles.sectionsContainer}>
                    <section className={styles.solutions}>
                        <h2>Примеры наших решений:</h2>
                        
                        <div className={styles.kitchenTable}>
                            <div className={styles.tableHeader}>
                                <h3>Кухни на любой вкус</h3>
                                <p>Гармония стиля и функциональности</p>
                            </div>
                            <div className={styles.tableContent}>
                                <div className={styles.offersHeader}>
                                    <span>Наши предложения:</span>
                                </div>
                                <div className={styles.offersGrid}>
                                    <div className={styles.offerItem}>
                                        <strong>Модульные кухни</strong>
                                        <span>Широкий выбор</span>
                                    </div>
                                    <div className={styles.offerItem}>
                                        <strong>Комплекты кухонь</strong>
                                        <span>Современные гарнитуры</span>
                                    </div>
                                    <div className={styles.offerItem}>
                                        <strong>Кухонные гарнитуры</strong>
                                        <span>Столы и стулья для кухни</span>
                                    </div>
                                    <div className={styles.offerItem}>
                                        <strong>Аксессуары</strong>
                                        <span>Полный комплект для кухни</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.about}>
                        <h2 id="about">О нас:</h2>
                        <ul className={styles.featuresList}>
                            <li className={styles.featureItem}>
                                <h3>⭐ Надежный партнер</h3>
                                <p>19 лет на рынке производства и оптовых поставок</p>
                            </li>
                            <li className={styles.featureItem}>
                                <h3>📦 Широкий ассортимент</h3>
                                <p>Свыше 3 000 наименований изделий для кухни, спальни, молодежной, гостиной или прихожей</p>
                            </li>
                            <li className={styles.featureItem}>
                                <h3>🤝 Качественные материалы</h3>
                                <p>Сотрудничество только с проверенными поставщиками</p>
                            </li>
                        </ul>
                    </section>
                </div>
                    <section className={styles.history}>
                        <h2 id="history">История и производственные мощности</h2>
                        <p>
                            Мебельная компания «Интерьер-Центр» изготавливает корпусную мебель с 2006 г. 
                            Компания располагает тремя цехами в г. Пензе. Площадь производственно-складских 
                            помещений — 50 тыс. м².
                        </p>
                        
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <strong>Год основания: 2006</strong>
                            </div>
                            <div className={styles.statItem}>
                                <strong>Количество цехов: 3</strong> 
                            </div>
                            <div className={styles.statItem}>
                                <strong>Местоположение: г. Пенза</strong> 
                            </div>
                            <div className={styles.statItem}>
                                <strong>Общая площадь: 50 000 м²</strong>
                            </div>
                        </div>

                        <h3>Производственные показатели и ассортимент</h3>
                        <p>
                            Предприятие производит 800 тыс. единиц мебели в год. В ассортименте продукции 
                            компании «Интерьер-Центр» более 3000 наименований.
                        </p>
                        
                        <div className={styles.productionStats}>
                            <div className={styles.productionItem}>
                                <strong>Годовой объем производства:</strong> 800 000 единиц
                            </div>
                            <div className={styles.productionItem}>
                                <strong>Ассортимент:</strong> более 3000 наименований
                            </div>
                        </div>

                        <div className={styles.categories}>
                            <h4>Основные категории продукции:</h4>
                            <ul className={styles.categoriesList}>
                                <li>Кухонная мебель</li>
                                <li>Мебель для спален</li>
                                <li>Детская мебель</li>
                                <li>Мебель для гостиных</li>
                                <li>Системы хранения</li>
                                <li>Столы</li>
                                <li>Металлические стулья</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default MainPage;