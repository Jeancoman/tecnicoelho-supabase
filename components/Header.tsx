import Link from "next/link";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <picture className={styles.container}>
        <source srcSet="/Logo-TecniCoelho-sin-eslogan.png" type="image/png" />
        <img
          src="/Logo-TecniCoelho-sin-eslogan.png"
          alt="Profile placeholder"
        />
      </picture>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <Link href={"/"}>
            <li className={styles.li}>
              <a className={styles.a}>Inicio</a>
            </li>
          </Link>
          <Link href={"/products"}>
            <li className={styles.li}>
              <a className={styles.a}>Productos</a>
            </li>
          </Link>
          <Link href={"/about"}>
            <li className={styles.li}>
              <a className={styles.a}>Nosotros</a>
            </li>
          </Link>
          <Link href={"/blog"}>
            <li className={styles.li}>
              <a className={styles.a}>Publicaciones</a>
            </li>
          </Link>
          <Link href={"/contact"}>
            <li className={styles.li}>
              <a className={styles.a}>Contacto</a>
            </li>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
