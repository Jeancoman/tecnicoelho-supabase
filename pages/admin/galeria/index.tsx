import { NextPage } from "next";
import { useEffect, useState } from "react";
import AdminPanel from "../../../components/AdminPanel";
import styles from "/styles/GaleriaPanel.module.css";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../../utilities/supabaseClient";
import Loader from "../../../components/Loader";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";

const Galeria: NextPage = () => {
  const [data, setData] = useState<{ [key: string]: string }[]>();
  const [toEdit, setToEdit] = useState<{ [key: string]: string }>();
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetch() {
      const imagenes = await supabase
        .from("imagen_descripción")
        .select(`id_imagen(enlace, id), texto`)
        .order("id_imagen", { ascending: true });

      const mapped: any = imagenes?.data?.map((data: any) => {
        return {
          ...data,
          id_imagen: data?.id_imagen.id,
          enlace: data?.id_imagen.enlace,
        };
      });

      console.log(mapped);

      setData(mapped);
    }

    if (!data) {
      fetch();
    }
  }, [data]);

  const editBtn = (id: string) => {
    const filtered = data?.filter((data) => data.id_imagen == id);
    const [doc] = filtered ?? [{}];
    setToEdit(doc);
    setEditing(true);
  };

  const deleteBtn = async (id: any) => {
    const eliminandoDescripcion = await supabase
      .from("imagen_descripción")
      .delete()
      .eq("id_imagen", id);

    const deletingImg = await supabase.from("imagen").delete().eq("id", id);

    setData(undefined);
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Panel de Control</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div>
          <AdminPanel />
          <button
            onClick={() => router.push("/admin/galeria/crear")}
            className={styles["new-button"]}
          >
            Añadir imagen
          </button>
        </div>
        {!editing && (
          <div className={styles["data-container"]}>
            <div className={styles["cel"]}>
              <div className={styles.row}>
                <h3>Imagen</h3>
                <h3>Descripción</h3>
                <h3>Acciones</h3>
              </div>
              {data?.map((doc) => {
                return (
                  <div className={styles.data} key={doc.id_imagen}>
                    <div>{doc.enlace}</div>
                    <div>{doc.texto}</div>
                    <div>
                      <button onClick={() => editBtn(doc.id_imagen)}>
                        Editar
                      </button>
                      <button onClick={() => deleteBtn(doc.id_imagen)}>
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
        {editing && (
          <EditForm
            data={toEdit}
            set={setEditing}
            value={editing}
            setData={setData}
          />
        )}
        <Toaster />
      </div>
    </>
  );
};

const EditForm = ({ data, set, value, setData }: any) => {
  const [texto, setTexto] = useState<string>(data.texto);
  const [imagen, setImagen] = useState<string>(data.enlace);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatePost = await supabase
      .from("imagen_descripción")
      .update({ texto: texto })
      .eq("id_imagen", data.id_imagen);

    console.log(data.id_imagen);

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
    set(!value);
  };

  return (
    <div className={styles["edit-form"]}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
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

export default Galeria;
