import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import styles from './ContactsPage.module.css';

function ContactsPage() {
    return (
        <div className={styles.container}>
            <Header />
            
            <main className={styles.main}>
                <div className={styles.content}>
                    <section className={styles.hero}>
                        <h1 className={styles.mainTitle}>Наши контакты</h1>
                    </section>

                    <div className={styles.sectionsContainer}>
                        <section className={styles.info}>
                            <div className={styles.card}>
                                <h2>Контактная информация</h2>
                                
                                <div className={styles.grid}>
                                    <div className={styles.column}>
                                        <div className={styles.item}>
                                            <h3>📍 Адрес производства</h3>
                                            <p>г. Пенза, ул. Производственная, 15</p>
                                        </div>
                                        
                                        <div className={styles.item}>
                                            <h3>📞 Телефоны</h3>
                                            <p>
                                                +7 (8412) 123-456 (основной)<br />
                                                +7 (8412) 123-457 (отдел продаж)<br />
                                                +7 (8412) 123-458 (служба качества)
                                            </p>
                                        </div>
                                        
                                        <div className={styles.item}>
                                            <h3>📧 Электронная почта</h3>
                                            <p>
                                                <a href="mailto:info@interior-center.ru">info@interior-center.ru</a> (общие вопросы)<br />
                                                <a href="mailto:sales@interior-center.ru">sales@interior-center.ru</a> (отдел продаж)<br />
                                                <a href="mailto:quality@interior-center.ru">quality@interior-center.ru</a> (контроль качества)
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.column}>
                                        <div className={styles.item}>
                                            <h3>🗺️ Мы на карте</h3>
                                            <div className={styles.mapContainer}>
                                                <iframe 
                                                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e&amp;source=constructor" 
                                                    width="100%" 
                                                    height="300" 
                                                    frameBorder="0"
                                                    title="Карта расположения компании"
                                                />
                                            </div>
                                            <p className={styles.mapNote}>
                                                <small>Для просмотра карты необходимо подключение к интернету</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <div className={styles.card}>
                                <h2>Напишите нам</h2>
                                
                                <form className={styles.form}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="name">Ваше имя</label>
                                            <input 
                                                type="text" 
                                                id="name"
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="email">Электронная почта</label>
                                            <input 
                                                type="email" 
                                                id="email"
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="phone">Номер телефона</label>
                                            <input 
                                                type="tel" 
                                                id="phone"
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label htmlFor="message">Ваш вопрос</label>
                                            <textarea 
                                                id="message"
                                                rows="5"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className={styles.formRow}>
                                        <button type="submit" className={styles.submitButton}>
                                            Отправить
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default ContactsPage;