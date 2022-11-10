import { GetServerSideProps, NextPage } from "next/types";
import { FormEvent, useEffect, useState } from "react";
import styles from "/styles/Login.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { supabase } from "../../../utilities/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const user = useUser();
  const [counter, setCounter] = useState(60);
  const [submited, setSubmited] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });
    setSubmited(true);
  };

  useEffect(() => {
    if (submited) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }

    if (counter === 0) {
      setSubmited(false);
      setCounter(60);
    }
  }, [counter, submited]);

  return (
    <>
      {" "}
      <Head>
        <title>Verificación</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className={styles.main}>
        <div className={styles["login-form"]}>
          <form onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={submited}>
              {submited ? <>{counter}</> : <>Enviar correo de verificación</>}
            </button>
          </form>
        </div>
        <Toaster />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/admin/publicaciones",
        permanent: false,
      },
    };

  return {
    props: {
      data: null,
    },
  };
};

export default Login;
