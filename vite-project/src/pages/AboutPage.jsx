import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './AboutPage.module.css'

function AboutPage() {
    return (
        <div className={styles.container}>
            <Header />
            
            <main className={styles.main}>
                <div className={styles.content}>
                    <section className={styles.hero}>
                        <h1 className={styles.mainTitle}>
                            О компании "Интерьер-Центр"
                        </h1>
                        <div className={styles.intro}>
                            <div className={styles.slogan}>
                                <h2>Создаем уют с 2006 года</h2>
                                <p>Профессионализм, качество и надежность
                                    Мы - команда профессионалов, которая уже более 19 лет создает 
                                    мебель для комфортной жизни. Наша философия - сочетание эстетики, 
                                    практичности и безупречного качества в каждом изделии.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className={styles.sectionsContainer}>
                        <section className={styles.companyInfo}>
                            <h2>Интерьер-Центр сегодня - это:</h2>
                            
                            <div className={styles.featuresGrid}>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>⭐</div>
                                    <h3>Надежный партнер</h3>
                                    <p>19 лет на рынке производства и оптовых поставок</p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>📦</div>
                                    <h3>Широкий ассортимент</h3>
                                    <p>Свыше 3 000 наименований изделий для кухни, спальни, молодежной, гостиной или прихожей</p>
                                </div>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>🤝</div>
                                    <h3>Качественные материалы</h3>
                                    <p>Сотрудничество только с проверенными поставщиками</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.wholesale} id="wholesale">
                            <h2>Специальные предложения для оптовых клиентов</h2>
                            
                            <div className={styles.servicesList}>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceImage}>
                                        <img src="src/img/service.webp" alt="3D-планировщик мебели" />
                                    </div>
                                    <div className={styles.serviceContent}>
                                        <h3>3D-планировщик мебели</h3>
                                        <p>
                                            Конструктор для дизайна интерьера с функцией расчета стоимости проекта. 
                                            В программе представлен весь ассортимент продукции.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceImage}>
                                        <img src="src\img\service2.webp" alt="Рекламная поддержка" />
                                    </div>
                                    <div className={styles.serviceContent}>
                                        <h3>Рекламная поддержка</h3>
                                        <p>
                                            Каталоги, pos-материалы, визуальный контент, образцы материалов, 
                                            экспозиторы и выставочные стенды. Фотобанк со всеми коллекциями 
                                            кухонь и корпусной мебели в облачном хранилище.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceImage}>
                                        <img src="src/img/service44.webp" alt="Дизайн бренд-секций" />
                                    </div>
                                    <div className={styles.serviceContent}>
                                        <h3>Дизайн бренд-секций</h3>
                                        <p>
                                            Выгодные условия на оформление экспозиции. Разработка дизайн-проекта 
                                            салона с учетом особенностей конфигурации помещения.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <section className={styles.team} id="team">
                        <h2>Наша команда</h2>
                        <p className={styles.teamNote}>
                            Я, внезапно, не нашел НИКАКОЙ информации о работниках завода из Пензы 
                            на 3 цеха со средним штатом в 21 человек
                        </p>
                        
                        <div className={styles.teamGrid}>
                            <div className={styles.teamMember}>
                                <div className={styles.memberPhoto}>
                                    <img src="src/img/Zima.jfif" alt="Иннокентий Зимов" />
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>Иннокентий Зимов</h3>
                                    <p>Основатель компании "Интерьер-центр", большой любитель металлических шестеренок</p>
                                </div>
                            </div>
                            
                            <div className={styles.teamMember}>
                                <div className={styles.memberPhoto}>
                                    <img src="src/img/MaoMao.png" alt="Мао Маовна" />
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>Мао Маовна</h3>
                                    <p>По слухам, внучка легендарного политика, химик и автор уникальных лаков</p>
                                </div>
                            </div>
                            
                            <div className={styles.teamMember}>
                                <div className={styles.memberPhoto}>
                                    <img src="src/img/hades-2-chaos-250-logo-v1.webp" alt="Первородный Хаос" />
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>Первородный Хаос</h3>
                                    <p>Создал нас всех и эту компанию тоже. Он призывает всех к ответу.</p>
                                </div>
                            </div>
                            
                            <div className={styles.teamMember}>
                                <div className={styles.memberPhoto}>
                                    <img src="src/img/Eva.jfif" alt="Эвелин Шевалье" />
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>Эвелин Шевалье</h3>
                                    <p>Главный дизайнер, воплощение женского стиля и лучшая женщина</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.certification} id="certification">
                        <h2>Сертификация и декларации соответствия</h2>
                        
                        <div className={styles.certificates}>
                            <a 
                                href="https://interior-center.ru/sertifikaty/#gallery-certificate-1" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.certificateLink}
                            >
                                Сертификат 1
                            </a>
                            <a 
                                href="https://interior-center.ru/sertifikaty/#gallery-certificate-1" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.certificateLink}
                            >
                                Сертификат 2
                            </a>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AboutPage;