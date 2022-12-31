import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Editor } from "@tinymce/tinymce-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
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
  const ref = useRef<HTMLInputElement | null>(null);

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
            .select();

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

  useEffect(() => {
    const element = ref.current;

    const validate = (string: string) => {
      const pattern = /^[0-9]+(?!.)|^[0-9]+[.]+[0-9]+/;
      console.log(pattern.test(string));
      console.log(string)
      if (pattern.test(string) === false) {
        element?.setCustomValidity(
          "Formato invalido. El formato esperado es [0.0], parte entera, punto decimal y parte decimal, o [0], número entero."
        );
      } else {
        element?.setCustomValidity("");
      }
    };

    element?.addEventListener("input", (e) => {
      const string = (e.target as HTMLInputElement).value;
      validate(string);
    });

    return () => {
      element?.removeEventListener("input", (e) => {
        const string = (e.target as HTMLInputElement).value;
        validate(string);
      });
    };
  }, []);

  return (
    <main className={styles["main-new"]}>
      <Head>
        <title>Panel de Control</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles["new-form"]}>
        <h2>Formulario de producto</h2>
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
            ref={ref}
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
                    <picture className={styles.close}>
                      <source srcSet="/close.svg" type="image/svg" />
                      <img src="/close.svg" alt="Close" />
                    </picture>
                  </span>
                ) : null}
              </div>
            );
          })}
          <button onClick={añadirImagen} className={styles["new-btn"]}>
            Añadir imagen
          </button>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY!}
            value={descripcion}
            onEditorChange={(evt, editor) =>
              setDescripcion(editor.getContent())
            }
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
      </div>
      <Toaster />
    </main>
  );
};

/*

export const getServerSideProps = withPageAuth({ redirectTo: "/admin/login" });

*/

export default NewForm;
