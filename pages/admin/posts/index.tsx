import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import AdminPanel from "../../../components/AdminPanel";
import styles from "/styles/PostPanel.module.css";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const Posts: NextPage = () => {
  const [data, setData] = useState<{ [key: string]: string }[]>();
  const [toEdit, setToEdit] = useState<{ [key: string]: string }>();
  const [editing, setEditing] = useState(false);
  console.log(data);

  useEffect(() => {
    async function fetch() {
    }
    fetch();
  }, []);

  const editBtn = (id: string) => {
    const filtered = data?.filter((data) => data.id == id);
    const [doc] = filtered ?? [{}];
    setToEdit(doc);
    setEditing(true);
  };

  return (
    <>
      <div className={styles.container}>
        <AdminPanel />
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
                    <div>{doc.fecha_creacion}</div>
                    <div>{doc.fecha_actualizacion}</div>
                    <div>
                      <button onClick={() => editBtn(doc.id)}>Editar</button>
                      <button>Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {editing && <EditForm data={toEdit} set={setEditing} value={editing} />}
      </div>
    </>
  );
};

const EditForm = ({ data, set, value }: any) => {
  const [contenido, setContenido] = useState<string>(data.contenido);
  const [titulo, setTitulo] = useState<string>(data.titulo);
  const [portada, setPortada] = useState<string>(data.imagen);

  const handleSubmit = (e: any) => {
    e.preventDefault();

  };

  return (
    <div className={styles["edit-form"]}>
      <h2>Publicación - {data.id}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          defaultValue={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          defaultValue={portada}
          onChange={(e) => setPortada(e.target.value)}
        />
        <textarea
          defaultValue={contenido}
          onChange={(e) => setContenido(e.target.value)}
        ></textarea>
        <div className={styles.buttons}>
          <button className={styles.button}>Guardar cambios</button>
          <button className={styles.button} onClick={() => set(!value)}>
            Volver
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

/* export async function getStaticProps() {
  const db = getFirestore(firebaseApp);
  const querySnapshot = await getDocs(collection(db, "publicaciones"));
  const data = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return {
    props: {
      data,
    },
  };
} */

export default Posts;
