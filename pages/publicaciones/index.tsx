import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import BlogFeed from "../../components/BlogFeed";
import { supabase } from "../../utilities/supabaseClient";
import styles from "/styles/Blog.module.css";

const Blog: NextPage = ({ data }: any) => {
  return (
    <main className={styles["blog-page"]}>
      <Head>
        <title>Publicaciones</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
        {data?.map((doc: any) => {
          return (
            <BlogFeed
              fecha={doc.creado_en}
              imagen={doc.id_imagen}
              contenido={doc.contenido}
              titulo={doc.titulo}
              key={doc.id}
              id={doc.id}
            />
          );
        })}
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const publicaciones = await supabase
    .from("publicación")
    .select(
      `id, creado_en, titulo, contenido, actualizado_en, id_imagen(enlace)`
    );

  const post = publicaciones.data?.map((publicacion: any) => {
    return {
      ...publicacion,
      id_imagen: publicacion.id_imagen.enlace,
    };
  });

  return {
    props: {
      data: post,
    },
  };
};

export default Blog;
