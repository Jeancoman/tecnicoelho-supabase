import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Header.module.css";
import cn from "classnames";

const Header = () => {
  const [display, setDisplay] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles["logo-menu"]}>
        <picture className={styles.container}>
          <source srcSet="/Logo-TecniCoelho-sin-eslogan.png" type="image/png" />
          <img
            src="/Logo-TecniCoelho-sin-eslogan.png"
            alt="Profile placeholder"
          />
        </picture>
        <picture className={styles.menu} onClick={() => setDisplay(!display)}>
          <source srcSet="/menu.svg" type="image/svg" />
          <img src="/menu.svg" alt="Profile placeholder" />
        </picture>
      </div>
      <nav
        className={cn({
          [styles["nav"] + " " + styles["toggled"]]: display,
          [styles["nav"] + " " + styles["active"]]: !display,
        })}
      >
        <ul className={styles.ul}>
          <Link href={"/"}>
            <li className={styles.li}>
              <a className={styles.a}>Inicio</a>
            </li>
          </Link>
          <Link href={"/productos"}>
            <li className={styles.li}>
              <a className={styles.a}>Productos</a>
            </li>
          </Link>
          <Link href={"/nosotros"}>
            <li className={styles.li}>
              <a className={styles.a}>Nosotros</a>
            </li>
          </Link>
          <Link href={"/galeria"}>
            <li className={styles.li}>
              <a className={styles.a}>Galería</a>
            </li>
          </Link>
          <Link href={"/publicaciones"}>
            <li className={styles.li}>
              <a className={styles.a}>Publicaciones</a>
            </li>
          </Link>
          <Link href={"/contacto"}>
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
