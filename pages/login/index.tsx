import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import styles from "/styles/Login.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const Login: NextPage = () => {

  return (
    <main className={styles.main}>
      <div className={styles["login-form"]}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Inicia sesión</h2>
          <input
            type="email"
            placeholder="Email"
          />
          <input
            type="password"
            placeholder="Contraseña"
          />
          <button>
            Iniciar sesión
          </button>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

export default Login;
