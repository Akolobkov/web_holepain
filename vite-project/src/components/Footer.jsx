import styles from "./Footer.module.css";
import img1 from "../img/Copyright.png";

function Footer() {
    const downloadAgreement = () => {
        const link = document.createElement('a');
        link.href = '/Майнер (3).pdf';
        link.download = 'Майнер.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return(
        <footer className={styles.footer}>
            <h4>Все права защищены <img src={img1} style={{height: "15px"}}/> </h4>
            <button 
                type="button" 
                onClick={downloadAgreement}
                className={styles.downloadButton}
            >
                📄 Скачать соглашение
            </button>
        </footer>
    );
}

export default Footer;