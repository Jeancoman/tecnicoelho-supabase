import { NextPage } from "next/types";
import { FormEvent, useState } from "react";
import styles from "/styles/Login.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { supabase } from "../../../utilities/supabaseClient";
import { getCookies } from "cookies-next";
import { useUser } from "@supabase/auth-helpers-react";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const user = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });
  };

  return (
    <>
      {user ? (
        router.push("/admin/posts/")
      ) : (
        <main className={styles.main}>
          <div className={styles["login-form"]}>
            <form onSubmit={handleSubmit}>
              <h2>Iniciar sesión</h2>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button>Enviar correo de confirmación</button>
            </form>
          </div>
          <Toaster />
        </main>
      )}
    </>
  );
};

export default Login;