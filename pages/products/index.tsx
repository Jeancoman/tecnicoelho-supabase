import type { GetServerSideProps, NextPage } from "next";
import styles from "/styles/Products.module.css";
import Product from "../../components/Product";
import { supabase } from "../../utilities/supabaseClient";
import Head from "next/head";

const Products: NextPage = ({ data }: any) => {
  return (
    <main>
      <Head>
        <title>Productos</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <section className={styles.products}>
        <div className={styles["left-container"]}>
          <input
            type="text"
            name="search_bar"
            id=""
            placeholder="Buscar producto..."
          />
        </div>
        <div className={styles["right-container"]}>
          <div className={styles.container}>
            {data.map((data: any) => {
              return (
                <Product
                  title={data?.nombre}
                  price={data?.precio}
                  image={data?.imagenes[0]}
                  id={data?.id}
                  key={data?.id}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const producto = await supabase.from("producto").select();

  const imagenProducto = await supabase
    .from("imagen_producto")
    .select(`id_producto, id_imagen(enlace)`);

  const curated: any = producto.data?.map((producto: any) => {
    const imagenes: any = imagenProducto.data?.filter(
      (imagen) => imagen.id_producto === producto.id
    );

    const enlaces: any = imagenes?.map(
      (imagen: any) => imagen.id_imagen.enlace
    );

    return {
      ...producto,
      imagenes: enlaces,
    };
  });

  return {
    props: {
      data: curated,
    },
  };
};

export default Products;
