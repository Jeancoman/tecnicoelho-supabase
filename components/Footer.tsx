import styles from "../styles/Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                Copyright © 2014-{new Date().getFullYear()} <strong>TecniCoelho</strong>
            </p>
        </footer>
    )
}

export default Footer;