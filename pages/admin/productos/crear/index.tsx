import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../../../../utilities/supabaseClient";
import styles from "/styles/ProductPanel.module.css";

const NewForm = () => {
  const [descripcion, setDescripcion] = useState<string>();
  const [nombre, setNombre] = useState<string>();
  const [precio, setPrecio] = useState<string>();
  const [imagenes, setImagenes] = useState<{ [key: string]: string }[]>([
    { enlace: "" },
  ]);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const inserting = await supabase.from("imagen").insert(imagenes).select();

    if (inserting?.status >= 200 && inserting?.status <= 299) {
      const producto = await supabase
        .from("producto")
        .insert({
          nombre: nombre,
          precio: Number(precio),
          descripción: descripcion,
        })
        .select()
        .single();

      const filtered = inserting?.data?.map((d) => {
        return {
          id_imagen: d.id,
          id_producto: producto.data.id,
        };
      });

      if (producto?.status >= 200 && producto?.status <= 299) {
        const imagenProducto = await supabase
          .from("imagen_producto")
          .insert(filtered)
          .select()
          .single();

        toast.success("Produco creado exitosamente.", {
          style: {
            fontFamily: "Open Sans",
          },
        });

        router.push("/admin/productos/");
      }
    } else {
      toast.error("Error al crear producto.", {
        style: {
          fontFamily: "Open Sans",
        },
      });
    }
  };

  const handleChange = (index: any, event: any) => {
    let data = [...imagenes];
    data[index][event.target.name] = event.target.value;
    setImagenes(data);
    console.log(imagenes);
  };

  const añadirImagen = (e: any) => {
    e.preventDefault();

    let newField = { enlace: "" };

    setImagenes([...imagenes, newField]);
  };

  const removeFields = (index: any) => {
    let data = [...imagenes];
    data.splice(index, 1);
    setImagenes(data);
  };

  return (
    <div className={styles["edit-form"]}>
      <Head>
        <title>Panel de Control</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h2>Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <input
          type="text"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
        />
        {imagenes.map((input, index) => {
          return (
            <div key={index} className={styles["image-form"]}>
              <input
                name="enlace"
                placeholder="Enlace de imagen"
                value={input.enlace}
                onChange={(e) => handleChange(index, e)}
              />
              {index > 0 ? (
                <span
                  className={styles.remove}
                  onClick={() => removeFields(index)}
                >
                  X
                </span>
              ) : null}
            </div>
          );
        })}
        <button onClick={añadirImagen} className={styles["new-btn"]}>
          Añadir enlace
        </button>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción..."
        ></textarea>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Guardar cambios
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => router.push("/admin/products")}
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
