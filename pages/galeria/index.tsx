import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "/styles/Galeria.module.css";
import markdown from "/styles/Markdown.module.css";
import ImageService from "../../utilities/imageService";
import { Imagen } from "../../types";

const Galeria: NextPage = ({ data }: any) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<string>();
  const [descripcion, setDescripcion] = useState<string>();
  const [images] = useState<Imagen[]>(data.rows || [])

  const handleClick = (src: string, description: string) => {
    setCurrent(src);
    setShow(true);
    setDescripcion(description);
  };

  console.log(images);

  return (
    <main className={styles.main}>
      <Head>
        <title>Galería</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles["h1"]}>
        <h1>Galería</h1>
        <div className={styles.container}>
          {images?.map((d, i: any) => {
            return (
              <picture
                key={i}
                className={styles.picture}
                onClick={() => handleClick(d.url, d.descripción || "")}
              >
                <source srcSet={d.url} />
                <img src={d.url} alt="Profile placeholder" />
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

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      setShow(!show);
    }
  }, []);

  const outsideClick = (event: MouseEvent) => {
    const dialog = ref.current;
    const e = event.target as HTMLElement;

    if (e.innerHTML === dialog?.innerHTML) {
      setShow(!show);
    }
  };

  useEffect(() => {
    const dialog = ref.current;

    dialog?.removeAttribute("open");

    if (show) {
      dialog?.showModal();
    }

    return () => dialog?.close();
  }, [show]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", outsideClick, true);

    return () => {
      document.removeEventListener("click", outsideClick, true);
    };
  }, []);

  return (
    <>
      <dialog className={styles.modal} ref={ref}>
        <picture className={styles.img}>
          <source srcSet={src} />
          <img src={src} alt="Profile placeholder" />
          <div className={styles.overlay}>
            <div
              className={markdown["markdown-body"]}
              dangerouslySetInnerHTML={{ __html: descripcion }}
            />
          </div>
        </picture>
        <picture onClick={() => setShow(!show)} className={styles.close}>
          <source srcSet="/close.svg" type="image/svg" />
          <img src="/close.svg" alt="Close" />
        </picture>
      </dialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await ImageService.getAll(1, 2000)

  return {
    props: {
      data,
    },
  };
};

export default Galeria;
