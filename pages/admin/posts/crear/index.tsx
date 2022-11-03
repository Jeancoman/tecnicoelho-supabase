import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../../../utilities/supabaseClient";
import styles from "/styles/PostPanel.module.css";

const NewForm: NextPage = () => {
  const [contenido, setContenido] = useState<string>();
  const [titulo, setTitulo] = useState<string>();
  const [imagen, setImagen] = useState<string>();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("imagen")
      .insert({ enlace: imagen })
      .select()
      .single();

    if (!!data) {
      const createPost = await supabase
        .from("publicación")
        .insert({ titulo: titulo, contenido: contenido, id_imagen: data.id })
        .select()
        .single();

      if (!!createPost.data) {
        toast.success("Publicación creada con exito", {
          style: {
            fontFamily: "Open Sans",
          },
        });
        router.push("/admin/posts");
      }
    } else if (error) {
      toast.error("Error al crear publicación.", {
        style: {
          fontFamily: "Open Sans",
        },
      });
    }
  };

  return (
    <div className={styles["new-form"]}>
      <Head>
        <title>Panel de Control</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h2>Nueva Publicación</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setTitulo(e.target.value)} placeholder="Titulo" />
        <input type="text" onChange={(e) => setImagen(e.target.value)} placeholder="Enlace de portada" />
        <textarea onChange={(e) => setContenido(e.target.value)} placeholder="Escribe tu publicación..."></textarea>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Crear
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => router.push("/admin/posts")}
          >
            Volver
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/admin/login" });

export default NewForm;
