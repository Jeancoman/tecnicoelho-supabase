import { withPageAuth } from "@supabase/auth-helpers-nextjs";
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
    try {
      const { data, error } = await supabase
        .from("imagen")
        .insert(imagenes)
        .select();

      if (error) {
        throw new Error("Error al crear imagenes.");
      } else {
        const producto = await supabase
          .from("producto")
          .insert({
            nombre: nombre,
            precio: Number(precio),
            descripción: descripcion,
          })
          .select()
          .single();

        const mapped = data?.map((d) => {
          return {
            id_imagen: d.id,
            id_producto: producto.data.id,
          };
        });

        if (producto.error) {
          throw new Error("Error al crear producto.");
        } else {
          const { error } = await supabase
            .from("imagen_producto")
            .insert(mapped)
            .select()
            .single();
          if (error) {
            throw new Error("Error al relacionar imagenes con el producto.");
          } else {
            toast.success("Produco creado exitosamente.", {
              style: {
                fontFamily: "Open Sans",
              },
            });
            router.push("/admin/productos/");
          }
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
          required
        />
        <input
          type="text"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          required
        />
        {imagenes.map((input, index) => {
          return (
            <div key={index} className={styles["image-form"]}>
              <input
                type="url"
                name="enlace"
                placeholder="http://www.enlacedeimagen.com"
                value={input.enlace}
                onChange={(e) => handleChange(index, e)}
                required
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
          placeholder="Descripción del producto..."
          required
        ></textarea>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Añadir producto
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => router.push("/admin/productos")}
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
