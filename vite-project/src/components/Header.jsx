import { useNavigate } from 'react-router-dom'; // Добавь этот импорт
import styles from "./Header.module.css";
import Button from "./Button";
import Logo from '../img/logo.png';
import userIcon from '../img/userIcon.jpg';
import enterImg from '../img/enter-icon.png'; 

const userId = localStorage.getItem('userId');
function Header () {
    const navigate = useNavigate();
    const userId = null;
    return(
        <header className={styles.header}>
           <img src= {Logo} alt='logo'  height={'70px'}/>

           <nav className={styles.block1}>

            <Button text = "Главная страница" to="/" ></Button>

           <Button text = "Каталог" to="/catalog"></Button>

           <Button text = "О нас" to="/about"></Button>

           <Button text = "Контактная информация" to="/contactinfo"></Button>
           
           </nav>

           <div className={styles.block2}>
               {
               userId ? (<button className={styles.button_}> <img src={userIcon} style={{height:'45px', marginTop:'10px', marginRight:'10px'}}  onClick={ () => { navigate (`/user/${userId}`) }} /> </button>):
                   (<button className={styles.button_}> <img src={enterImg} style={{height:'45px', marginTop:'10px', marginRight:'10px'}} onClick={ () => { navigate ('/login') }} /> </button>)
                 }

           </div>
    
        </header>
    )
}

export default Header;