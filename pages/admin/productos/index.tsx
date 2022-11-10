import { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import AdminPanel from "../../../components/AdminPanel";
import styles from "/styles/ProductPanel.module.css";
import { useRouter } from "next/router";
import { supabase } from "../../../utilities/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../../components/Loader";
import { getCookies } from "cookies-next";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";

const ProductosPage: NextPage = () => {
  const [data, setData] = useState<{ [key: string]: string }[]>();
  const [toEdit, setToEdit] = useState<{ [key: string]: string }>();
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  console.log(data);

  useEffect(() => {
    async function fetch() {
      const producto = await supabase
        .from("producto")
        .select()
        .order("id", { ascending: true });

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

  const deleteBtn = async (id: any, imagenes: any) => {
    const deleting = await supabase
      .from("producto")
      .delete()
      .eq("id", id)
      .select();

    console.log(deleting);

    imagenes?.forEach(async (img: any) => {
      const deleting = await supabase
        .from("imagen_producto")
        .delete()
        .eq("id_imagen", img.id);
    });

    imagenes?.forEach(async (img: any) => {
      const deleting = await supabase
        .from("imagen")
        .delete()
        .eq("imagen", img.id);
    });

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
          {!editing && (
            <button
              onClick={() => router.push("/admin/productos/crear")}
              className={styles["new-button"]}
            >
              Añadir producto
            </button>
          )}
        </div>
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
                      <button onClick={() => deleteBtn(doc.id, doc.imagenes)}>
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
          <EditForm producto={toEdit} set={setEditing} value={editing} setData={setData} />
        )}
        <Toaster />
      </div>
    </>
  );
};

const EditForm = ({ producto, set, value, setData }: any) => {
  const [descripcion, setDescripcion] = useState<string>(producto.descripción);
  const [nombre, setNombre] = useState<string>(producto.nombre);
  const [precio, setPrecio] = useState<string>(producto.precio);
  const [imagenes, setImagenes] = useState<{ [key: string]: string }[]>(
    producto.imagenes
  );
  const [eliminar, setEliminar] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    eliminar?.forEach(async (id) => {
      const deleting = await supabase
        .from("imagen_producto")
        .delete()
        .eq("id_imagen", id)
        .select();

        if(deleting.status > 299){
          setError(true);
        }
    });

    if (error) {
      toast.error("Error al actualizar producto.", {
        style: {
          fontFamily: "Open Sans",
        },
      });
    } else {
      eliminar?.forEach(async (id) => {
        const deleting = await supabase
          .from("imagen")
          .delete()
          .eq("id", id)
          .select();
      });
    }

    imagenes.forEach(async (img, index) => {
      if (img.hasOwnProperty("id")) {
        const updating = await supabase
          .from("imagen")
          .update({ enlace: img.imagen })
          .eq("id", img.id)
          .select()
          .single();
      } else {
        const inserting = await supabase
          .from("imagen")
          .insert({ enlace: img.imagen })
          .select()
          .single();

        if (inserting.status >= 200 && inserting.status <= 299) {
          const insertingIP = await supabase
            .from("imagen_producto")
            .insert({ id_imagen: inserting.data.id, id_producto: producto.id })
            .select();
        }
      }

      if(index === imagenes.length - 1 ){
        toast.success("Producto actualizado", {
          style: {
            fontFamily: "Open Sans",
          },
        });
        setData(undefined);
        set(!value)
      }
    });

    const updating = await supabase
      .from("producto")
      .update({
        nombre: nombre,
        precio: Number(precio),
        descripción: descripcion,
      })
      .eq("id", producto.id);
  };

  const handleChange = (index: any, event: any) => {
    let data = [...imagenes];
    data[index][event.target.name] = event.target.value;
    setImagenes(data);
  };

  const añadirImagen = (e: any) => {
    e.preventDefault();

    let newField = { imagen: "" };

    setImagenes([...imagenes, newField]);
  };

  const removeFields = (index: any, id: any) => {
    let data = [...imagenes];

    data.splice(index, 1);

    if (typeof id == "number") {
      setEliminar(eliminar.concat(id));
      console.log(eliminar);
    }

    setImagenes(data);
  };

  return (
    <div className={styles["edit-form"]}>
      <h2>Producto - {producto.id}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        {imagenes.map((input, index) => {
          return (
            <div key={index} className={styles["image-form"]}>
              <input
                name="imagen"
                placeholder="Imagen"
                value={input.imagen}
                onChange={(e) => handleChange(index, e)}
              />
              {index > 0 ? (
                <span
                  className={styles.remove}
                  onClick={() => removeFields(index, input?.id)}
                >
                  X
                </span>
              ) : null}
            </div>
          );
        })}
        <button onClick={añadirImagen} className={styles["add-button"]}>
          Añadir enlace
        </button>
        <textarea
          value={descripcion}
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

export const getServerSideProps = withPageAuth({ redirectTo: "/admin/login" });

export default ProductosPage;
