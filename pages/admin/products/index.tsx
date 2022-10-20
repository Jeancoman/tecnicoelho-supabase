import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import AdminPanel from "../../../components/AdminPanel";
import styles from "/styles/ProductPanel.module.css";
import { useRouter } from "next/router";
import { supabase } from "../../../utilities/supabaseClient";

const ProductosPage: NextPage = () => {
  const [data, setData] = useState<{ [key: string]: string }[]>();
  const [toEdit, setToEdit] = useState<{ [key: string]: string }>();
  const [editing, setEditing] = useState(false);
  console.log(data);

  useEffect(() => {
    async function fetch() {
      const producto = await supabase.from("producto").select();

      const imagenProducto = await supabase
        .from("imagen_producto")
        .select(`id_producto, id_imagen(id, enlace)`);

      const curated: any = producto.data?.map((producto: any) => {
        const imagenes: any = imagenProducto.data?.filter(
          (imagen) => imagen.id_producto === producto.id
        );

        const enlaces: any = imagenes?.map((imagen: any) => {
          return { imagen: imagen.id_imagen.enlace, id: imagen.id_imagen.id };
        });

        return {
          ...producto,
          imagenes: enlaces,
        };
      });

      setData(curated);
      console.log(curated);
    }
    fetch();
  }, []);

  const editBtn = (id: string) => {
    const filtered = data?.filter((data) => data.id == id);
    const [doc] = filtered ?? [{}];
    setToEdit(doc);
    setEditing(true);
  };

  console.log(editing);

  return (
    <>
      <div className={styles.container}>
        <AdminPanel />
        {!editing && (
          <div className={styles["data-container"]}>
            <div className={styles["cel"]}>
              <div className={styles.row}>
                <h3>Nombre</h3>
                <h3>Precio</h3>
                <h3>Creado</h3>
                <h3>Actualizado</h3>
                <h3>Acciones</h3>
              </div>
              {data?.map((doc) => {
                return (
                  <div className={styles.data} key={doc.id}>
                    <div>{doc.nombre}</div>
                    <div>{doc.precio}</div>
                    <div>{doc.creado_en}</div>
                    <div>{doc.actualizado_en}</div>
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
        {editing && (
          <EditForm producto={toEdit} set={setEditing} value={editing} />
        )}
      </div>
    </>
  );
};

const EditForm = ({ producto, set, value }: any) => {
  const [descripcion, setDescripcion] = useState<string>(producto.descripción);
  const [nombre, setNombre] = useState<string>(producto.nombre);
  const [precio, setPrecio] = useState<string>(producto.precio);
  const [imagenes, setImagenes] = useState<{ [key: string]: string }[]>(
    producto.imagenes
  );
  const [id, setId] = useState<any>();
  const [eliminar, setEliminar] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("imagen")
        .select()
        .order("id", { ascending: false })
        .limit(1)
        .single();
      setId(data.id);
    }

    async function imagenProducto() {
      const { data, error } = await supabase
        .from("imagen_producto")
        .select()
        .eq("id_producto", producto.id);
    }

    imagenProducto();
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    set(!value);
  };

  const handleChange = (index: any, event: any) => {
    let data = [...imagenes];
    data[index][event.target.name] = event.target.value;
    setImagenes(data);
    console.log(imagenes);
        console.log(eliminar);
  };

  const añadirImagen = (e: any) => {
    e.preventDefault();

    let newField = { imagen: "", id: id + 1 };

    setId(id + 1);

    setImagenes([...imagenes, newField]);
  };

  const eliminarImagenSupabase = () => {};

  const removeFields = (index: any, id: any) => {
    let data = [...imagenes];
    data.splice(index, 1);
    
    setEliminar(eliminar.concat(id));

    console.log(eliminar);

    setImagenes(data);
  };

  return (
    <div className={styles["edit-form"]}>
      <h2>Producto - {producto.id}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          defaultValue={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          defaultValue={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        {imagenes.map((input, index) => {
          return (
            <div key={index} className={styles["image-form"]}>
              <input
                name="imagen"
                placeholder="Imagen"
                defaultValue={input.imagen}
                onChange={(e) => handleChange(index, e)}
              />
              { index > 0 ?
              <span className={styles.remove} onClick={() => removeFields(index, input.id)}>
                X
              </span> : null}
            </div>
          );
        })}
        <button onClick={añadirImagen}>Add More..</button>
        <textarea
          defaultValue={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
        <div className={styles.buttons}>
          <button className={styles.button}>Guardar cambios</button>
          <button className={styles.button} onClick={() => set(!value)}>
            Volver
          </button>
        </div>
      </form>
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

export default ProductosPage;
