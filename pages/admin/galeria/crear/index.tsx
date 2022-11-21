import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../../../utilities/supabaseClient";
import styles from "/styles/GaleriaPanel.module.css";

const NewForm: NextPage = () => {
  const [texto, setTexto] = useState<string>();
  const [imagen, setImagen] = useState<string>();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("imagen")
        .insert({ enlace: imagen })
        .select()
        .single();
      if (error) {
        throw new Error("Error al crear imagen.");
      } else {
        const { error } = await supabase
          .from("imagen_descripción")
          .insert({ texto: texto, id_imagen: data.id })
          .select()
          .single();
        if (error) {
          throw new Error("Error al crear descripción de la imagen.");
        } else {
          toast.success("Imagen añadida a la galería", {
            style: {
              fontFamily: "Open Sans",
            },
          });
          router.push("/admin/galeria");
        }
      }
    } catch {
      toast.error("Error al añadir imagen a la galería", {
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
      <h2>Nueva imagen</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          onChange={(e) => setImagen(e.target.value)}
          placeholder="http://www.enlacedeimagen.com"
          required
        />
        <textarea
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Descripción de la imagen..."
          required
        ></textarea>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Crear nueva imagen
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => router.push("/admin/galeria")}
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
