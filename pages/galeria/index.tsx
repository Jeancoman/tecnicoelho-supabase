import { useUser } from "@supabase/auth-helpers-react";
import { GetStaticProps, NextPage } from "next";
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
    setDescripcion(description)
  }

  console.log(user)

  return (
    <main className={styles.main}>
      <div className={styles["h1"]}>
        <h1>Galería</h1>
        <div className={styles.container}>
          {data?.map((d: any, i: any) => {
            return (
              <picture key={i} className={styles.picture} onClick={() => handleClick(d.id_imagen, d.descripcion)}>
                <source srcSet={d.id_imagen} />
                <img src={d.id_imagen} alt="Profile placeholder" />
              </picture>
            );
          })}
        </div>
      </div>
      <Dialog show={show} setShow={setShow} src={current} descripcion={descripcion} />
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
          <img src={src} alt="Profile placeholder"/>
          <div className={styles.overlay}>{descripcion}</div>
        </picture>
        <span onClick={() => setShow(!show)}>X</span>
      </dialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await supabase
    .from("descripción")
    .select("id, descripcion, id_imagen(enlace)");

  const mapped = data?.map((data: any) => {
    return {
      ...data,
      id_imagen: data?.id_imagen.enlace,
    };
  });

  console.log(mapped);

  return {
    props: {
      data: mapped,
    },
  };
};

export default Galeria;
