import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Editor } from "@tinymce/tinymce-react";
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

    try {
      const { data, error } = await supabase
        .from("imagen")
        .insert({ enlace: imagen })
        .select()
        .single();

      if (error) {
        throw new Error("Error al crear portada.");
      } else {
        const { error } = await supabase
          .from("publicación")
          .insert({ titulo: titulo, contenido: contenido, id_imagen: data.id })
          .select()
          .single();

        if (error) {
          throw new Error("Error al crear publicación.");
        } else {
          toast.success("Publicación creada exitosamente.", {
            style: {
              fontFamily: "Open Sans",
            },
          });
          router.push("/admin/publicaciones");
        }
      }
    } catch (e: any) {
      toast.error(e.message, {
        style: {
          fontFamily: "Open Sans",
        },
      });
    }
  };

  return (
    <main className={styles["main-new"]}>
      <Head>
        <title>Panel de Control</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles["new-form"]}>
        <h2>Formulario de publicación</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            required
          />
          <input
            type="url"
            onChange={(e) => setImagen(e.target.value)}
            placeholder="http://www.enlacedeimagen.com"
            required
          />
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY!}
            value={contenido}
            onEditorChange={(evt, editor) => setContenido(editor.getContent())}
            init={{
              height: 500,
              menubar: true,
              font_formats: "",
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "emoticons",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap'); body { font-family:Open Sans,Helvetica,Arial,sans-serif; font-size:14px }",
              language: "es",
            }}
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.button}>
              Añadir publicación
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => router.push("/admin/publicaciones")}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </main>
  );
};

/*

export const getServerSideProps = withPageAuth({ redirectTo: "/admin/login" });

*/

export default NewForm;
