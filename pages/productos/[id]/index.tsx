import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "/styles/ProductPage.module.css";
import markdown from "/styles/Markdown.module.css";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../../../components/Modal";
import Head from "next/head";
import ProductService from "../../../utilities/productService";
import { Producto } from "../../../types";

const ProductPage: NextPage = ({ data }: any) => {
  const [product] = useState<Producto>(data)
  const [actualImage, setActualImage] = useState<string>(product?.imagens?.[0]?.url || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081");
  const [images, setImages] = useState<string[]>(product?.imagens?.map((img) => img.url) || []);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleImg = (img: string) => {
    setActualImage(img);
  };

  const formatter = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
  });

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
              Precio unitario de <span>{formatter.format(data?.precio)}</span>
            </div>
            <button className={styles.button} onClick={handleShow}>
              contáctanos 
            </button>
          </div>
        </div>
        <div className={styles["inferior-container"]}>
          <div className={styles["des-com"]}>
            <div className={styles.active}>Descripción</div>
          </div>
          <hr />
          <div className={styles["descom-container"]}>
            <div className={markdown["markdown-body"]} dangerouslySetInnerHTML={{__html: data?.descripción}} />
          </div>
        </div>
      <Modal show={show} handleClose={handleClose} producto={data?.nombre} />
      <Toaster />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }: any) => {
  const producto = await ProductService.getBySlug(params.id);


  if(!producto){
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data: producto,
    },
  };
};

export default ProductPage;
