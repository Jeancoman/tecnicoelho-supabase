import { NextPage } from "next";
import styles from "/styles/Portal.module.css";
import Head from "next/head";
import TicketElement from "../../components/TicketElement";
import OperacionDataDisplay from "../../components/OperacionDataDisplay";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Portal</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        <aside className={styles["ticket-list-container"]}>
          <input type="text" placeholder="Buscar ticket..." />
          <hr />
          <div className={styles["ticket-list"]}>
            <TicketElement />
          </div>
        </aside>
        <nav className={styles.navbar}>
          <img src="/Logo-TecniCoelho-sin-eslogan.png" />
          <div className={styles.dropdown}>
            <div className={styles.user}>Jean Bolívar</div>
            <div className={styles["dropdown-content"]}>
              <div>Nuevo ticket</div>
              <div>Mis elementos</div>
              <div>Cerrar sesión</div>
            </div>
          </div>
        </nav>
        <main className={styles.display}>
          <OperacionDataDisplay />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
