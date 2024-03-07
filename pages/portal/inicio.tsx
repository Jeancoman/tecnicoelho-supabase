import { NextPage } from "next";
import styles from "/styles/Inicio.module.css";
import Head from "next/head";
import { useState } from "react";

const Inicio: NextPage = () => {
  const [option, setOption] = useState<"BUSCAR" | "ABRIR" | "LOGIN">("BUSCAR");

  return (
    <>
      <Head>
        <title>Portal</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        {option === "BUSCAR" && (
          <div className={styles["form-container"]}>
            <div>
              <h2>¡Encuentra tu ticket ahora!</h2>
              <form>
                <div>
                  <input type="text" placeholder="ID de tu ticket" />
                </div>
                <div>
                  <input type="text" placeholder="Tu contraseña" />
                </div>
              </form>
              <button className={styles["search-btn"]}>Buscar</button>
              <div className={styles.or}>
                <hr />
                <div>O</div>
                <hr />
              </div>
              <div className={styles["or-two"]}>
                <div
                  onClick={() => {
                    setOption("ABRIR");
                  }}
                >
                  Abrir un ticket
                </div>
                <div></div>
                <div
                  onClick={() => {
                    setOption("LOGIN");
                  }}
                >
                  Iniciar sesión
                </div>
              </div>
            </div>
          </div>
        )}
        {option === "LOGIN" && (
          <div className={styles["form-container"]}>
            <div>
              <h2>¡Inicia sesión en tu cuenta!</h2>
              <form>
                <div>
                  <input type="text" placeholder="Tu ID de usuario" />
                </div>
                <div>
                  <input type="text" placeholder="Tu contraseña" />
                </div>
              </form>
              <button className={styles["search-btn"]}>Continuar</button>
              <div className={styles.or}>
                <hr />
                <div>O</div>
                <hr />
              </div>
              <div className={styles["or-two"]}>
                <div
                  onClick={() => {
                    setOption("ABRIR");
                  }}
                >
                  Abrir un ticket
                </div>
                <div></div>
                <div
                  onClick={() => {
                    setOption("BUSCAR");
                  }}
                >
                  Buscar un ticket
                </div>
              </div>
            </div>
          </div>
        )}
        {option === "ABRIR" && (
          <div className={styles["form-container"]}>
            <div>
              <h2>¡Abre un ticket!</h2>
              <form>
                <div>
                  <input type="text" placeholder="Tu ID de usuario" />
                </div>
                <div>
                  <input type="text" placeholder="Tu contraseña" />
                </div>
              </form>
              <button className={styles["search-btn"]}>Continuar</button>
              <div className={styles.or}>
                <hr />
                <div>O</div>
                <hr />
              </div>
              <div className={styles["or-two"]}>
                <div
                  onClick={() => {
                    setOption("LOGIN");
                  }}
                >
                  Iniciar sesión
                </div>
                <div></div>
                <div
                  onClick={() => {
                    setOption("BUSCAR");
                  }}
                >
                  Buscar un ticket
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Inicio;
