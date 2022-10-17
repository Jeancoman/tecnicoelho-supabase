import { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "/styles/SingIn.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const SingIn: NextPage = () => {
  const router = useRouter();


  return (
    <main className={styles.main}>
      <div className={styles["sing-in-form"]}>
        <form>
          <h2>Regístrate</h2>
          <input
            type="text"
            placeholder="Nombres"
          />
          <input
            type="text"
            placeholder="Apellidos"
          />
          <input
            type="text"
            placeholder="Cedula de Identidad"
          />
          <input
            type="email"
            placeholder="Email"
          />
          <input
            type="text"
            placeholder="Contraseña"
          />
          <input
            type="tel"
            placeholder="Numero de Telefono"
          />
          <button>Registrarse</button>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

export default SingIn;
