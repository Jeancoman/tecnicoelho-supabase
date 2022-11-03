import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState } from "react";
import { supabase } from "../../../utilities/supabaseClient";
import styles from "/styles/ProductPage.module.css";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../../../components/Modal";
import Head from "next/head";

const ProductPage: NextPage = ({ data }: any) => {
  const [actualImage, setActualImage] = useState<string>(data?.imagenes[0]);
  const [images, setImages] = useState<string[]>(data?.imagenes);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleImg = (img: string) => {
    setActualImage(img);
  };

  return (
    <main className={styles.product}>
      <Head>
        <title>{data?.nombre}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
        <div className={styles.container}>
          <div className={styles["product-view"]}>
            <picture className={styles.image}>
              <source srcSet={actualImage} width="300" height="300" />
              <img src={actualImage} alt="Product" />
            </picture>
            <div className={styles.boxes}>
              {images?.map((image, index) => {
                return (
                  <div
                    className={styles.box}
                    key={index}
                    onClick={() => toggleImg(image)}
                  >
                    <picture>
                      <source srcSet={image} />
                      <img src={image} alt="Product" />
                    </picture>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles["product-info"]}>
            <h3>{data?.nombre}</h3>
            <div className={styles.price}>
              Precio unitario de <span>${data?.precio} USD</span>
            </div>
            <button className={styles.button} onClick={handleShow}>
              Contáctanos por email
            </button>
          </div>
        </div>
        <div className={styles["inferior-container"]}>
          <div className={styles["des-com"]}>
            <div className={styles.active}>Descripción</div>
          </div>
          <hr />
          <div className={styles["descom-container"]}>
            <p>{data?.descripción}</p>
          </div>
        </div>
      <Modal show={show} handleClose={handleClose} producto={data?.nombre} />
      <Toaster />
    </main>
  );
};

export const getStaticPaths = async () => {
  const productos = await supabase.from("producto").select();

  const paths = productos.data?.map((product: any) => {
    return {
      params: {
        id: product.id.toString(),
      },
    };
  });

  console.log(paths);

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const producto = await supabase.from("producto").select().eq("id", params.id);
  const imagenProducto = await supabase
    .from("imagen_producto")
    .select(`id_producto, id_imagen(enlace)`);

  const curated = producto.data?.map((producto) => {
    const imagenes = imagenProducto.data?.filter(
      (imagen) => imagen.id_producto === producto.id
    );

    const enlaces = imagenes?.map((imagen: any) => imagen.id_imagen.enlace);

    return {
      ...producto,
      imagenes: enlaces,
    };
  });

  const data = curated?.[0];

  if(!data){
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data,
    },
    revalidate: 10
  };
};

export default ProductPage;
