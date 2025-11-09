import styles from "./Button.module.css";
import { useNavigate } from 'react-router-dom';

function Button({ text, to }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    return(
        <button className={styles.button} onClick={handleClick}>
            {text}
        </button>
    );
}

export default Button;