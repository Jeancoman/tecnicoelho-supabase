import { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import AdminPanel from "../../../components/AdminPanel";
import styles from "/styles/PostPanel.module.css";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../../utilities/supabaseClient";
import Loader from "../../../components/Loader";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";

const Posts: NextPage = () => {
  const [data, setData] = useState<{ [key: string]: string }[]>();
  const [toEdit, setToEdit] = useState<{ [key: string]: string }>();
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetch() {
      const publicaciones = await supabase
        .from("publicación")
        .select(
          `id, creado_en, titulo, contenido, actualizado_en, id_imagen(id, enlace)`
        );

      console.log(publicaciones);

      const post = publicaciones.data?.map((publicacion: any) => {
        return {
          ...publicacion,
          imagen: publicacion.id_imagen.enlace,
          id_imagen: publicacion.id_imagen.id,
        };
      });
      setData(post);
    }
    if (!data) {
      fetch();
    }
  }, [data]);

  const editBtn = (id: string) => {
    const filtered = data?.filter((data) => data.id == id);
    const [doc] = filtered ?? [{}];
    setToEdit(doc);
    setEditing(true);
  };

  const deleteBtn = async (id: any, id_imagen: any) => {
    const deletingPost = await supabase
      .from("publicación")
      .delete()
      .eq("id", id);
    const deletingImg = await supabase
      .from("imagen")
      .delete()
      .eq("id", id_imagen);

    setData(undefined);
  };

  return (
    <>
      <div className={styles.container}>
      <Head>
        <title>Panel de Control</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
        <div>
          <AdminPanel />
          <button
            onClick={() => router.push("/admin/posts/crear")}
            className={styles["new-button"]}
          >
            Nueva publicación
          </button>
        </div>
        {!editing && (
          <div className={styles["data-container"]}>
            <div className={styles["cel"]}>
              <div className={styles.row}>
                <h3>Titulo</h3>
                <h3>Portada</h3>
                <h3>Creado</h3>
                <h3>Actualizado</h3>
                <h3>Acciones</h3>
              </div>
              {data?.map((doc) => {
                return (
                  <div className={styles.data} key={doc.id}>
                    <div>{doc.titulo}</div>
                    <div>{doc.imagen}</div>
                    <div>{doc.creado_en}</div>
                    <div>{doc.actualizado_en}</div>
                    <div>
                      <button onClick={() => editBtn(doc.id)}>Editar</button>
                      <button onClick={() => deleteBtn(doc.id, doc.id_imagen)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {!data && (
              <div className={styles.loader}>
                <Loader />
              </div>
            )}
          </div>
        )}
        {editing && <EditForm data={toEdit} set={setEditing} value={editing} setData={setData} />}
        <Toaster />
      </div>
    </>
  );
};

const EditForm = ({ data, set, value, setData }: any) => {
  const [contenido, setContenido] = useState<string>(data.contenido);
  const [titulo, setTitulo] = useState<string>(data.titulo);
  const [imagen, setImagen] = useState<string>(data.imagen);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatePost = await supabase
      .from("publicación")
      .update({ titulo: titulo, contenido: contenido })
      .eq("id", data.id);

    const updateImagenPost = await supabase
      .from("imagen")
      .update({ enlace: imagen })
      .eq("id", data.id_imagen);

      toast.success("Producto actualizado", {
        style: {
          fontFamily: "Open Sans",
        },
      });

      setData(undefined);
      set(!value)
  };

  return (
    <div className={styles["edit-form"]}>
      <h2>{titulo}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          defaultValue={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          defaultValue={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
        <textarea
          defaultValue={contenido}
          onChange={(e) => setContenido(e.target.value)}
        ></textarea>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Guardar cambios
          </button>
          <button className={styles.button} onClick={() => set(!value)}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/admin/login" });

export default Posts;
