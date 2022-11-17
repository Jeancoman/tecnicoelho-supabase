import { GetStaticProps, NextPage } from "next";
import { supabase } from "../../../utilities/supabaseClient";
import styles from "/styles/BlogPost.module.css";
import Head from "next/head";

const Post: NextPage = ({ data }: any) => {
  console.log(data);
  return (
    <main className={styles.main}>
      <Head>
        <title>{data?.titulo}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        <div>
          <picture>
            <source srcSet={data?.id_imagen} />
            <img
              src={data?.id_imagen}
              alt="Perfil"
              referrerPolicy="no-referrer"
            />
          </picture>
        </div>
        <div className={styles.preview}>
          <div className={styles.fecha}>Fecha de creación: {data?.creado_en.slice(0, 10)}</div>
          <div className={styles.titulo}>{data?.titulo}</div>
          <p className={styles.contenido}>{data?.contenido}</p>
        </div>
      </div>
    </main>
  );
};

export const getStaticPaths = async () => {
  const publicaciones = await supabase
    .from("publicación")
    .select(
      `id, creado_en, titulo, contenido, actualizado_en, id_imagen(enlace)`
    );

  const data = publicaciones.data?.map((publicacion: any) => {
    return {
      ...publicacion,
      id_imagen: publicacion.id_imagen.enlace,
    };
  });

  const paths = data?.map((post: any) => {
    return {
      params: {
        id: post.id.toString(),
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
  const publicaciones = await supabase
    .from("publicación")
    .select(
      `id, creado_en, titulo, contenido, actualizado_en, id_imagen(enlace)`
    )
    .eq("id", params.id);

  const post = publicaciones.data?.map((publicacion: any) => {
    return {
      ...publicacion,
      id_imagen: publicacion.id_imagen.enlace,
    };
  });

  const data = post?.[0];

  if(!data){
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data,
    },
  };
};

export default Post;
