import "./Footer.module.css"
import img1 from "../img/Copyright.png"

function Footer () {
    return(
        <footer>

            <h4>Все права защищены <img src={img1} style={{height: "15px"}}/> </h4>
        </footer>
    );
}

export default Footer;