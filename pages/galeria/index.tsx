import { useUser } from "@supabase/auth-helpers-react";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utilities/supabaseClient";
import styles from "/styles/Galeria.module.css";

const Galeria: NextPage = ({ data }: any) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<string>();
  const [descripcion, setDescripcion] = useState<string>();
  const user = useUser();

  const handleClick = (src: string, description: string) => {
    setCurrent(src);
    setShow(true);
    setDescripcion(description);
  };

  console.log(user);

  return (
    <main className={styles.main}>
      <Head>
        <title>Galería</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles["h1"]}>
        <h1>Galería</h1>
        <div className={styles.container}>
          {data?.map((d: any, i: any) => {
            return (
              <picture
                key={i}
                className={styles.picture}
                onClick={() => handleClick(d.enlace, d.texto)}
              >
                <source srcSet={d.enlace} />
                <img src={d.enlace} alt="Profile placeholder" />
              </picture>
            );
          })}
        </div>
      </div>
      <Dialog
        show={show}
        setShow={setShow}
        src={current}
        descripcion={descripcion}
      />
    </main>
  );
};

const Dialog = ({ show, setShow, src, descripcion }: any) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;

    dialog?.removeAttribute("open");

    if (show) {
      dialog?.showModal();
    }

    return () => dialog?.close();
  }, [show]);

  return (
    <>
      <dialog className={styles.modal} ref={ref}>
        <picture className={styles.img}>
          <source srcSet={src} />
          <img src={src} alt="Profile placeholder" />
          <div className={styles.overlay}>{descripcion}</div>
        </picture>
        <span onClick={() => setShow(!show)}>X</span>
      </dialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await supabase
    .from("imagen_descripción")
    .select("texto, id_imagen(enlace)");

  const mapped = data?.map((data: any) => {
    return {
      ...data,
      id_imagen: data?.id_imagen,
      enlace: data?.id_imagen.enlace,
    };
  });

  return {
    props: {
      data: mapped,
    },
  };
};

export default Galeria;
