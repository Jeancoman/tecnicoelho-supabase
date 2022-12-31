import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import BlogFeed from "../../components/BlogFeed";
import Loader from "../../components/Loader";
import { supabase } from "../../utilities/supabaseClient";
import styles from "/styles/Blog.module.css";

const Blog: NextPage = ({ data }: any) => {
  const [post, setPost] = useState(data);
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(19);
  const [morePost, setMorePost] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const fetchPost = async () => {
    const publicaciones = await supabase
      .from("publicación")
      .select(
        `id, creado_en, titulo, contenido, actualizado_en, id_imagen(enlace)`
      )
      .order("creado_en", { ascending: false })
      .range(from, to);

    const returnedPost = publicaciones.data?.map((publicacion: any) => {
      return {
        ...publicacion,
        id_imagen: publicacion.id_imagen.enlace,
      };
    });

    setMorePost(returnedPost);
    setPost(post.concat(returnedPost));
  };

  const areMorePost = () => {
    if (post.length < 10) {
      setIsEnd(true);
    }
    if (morePost?.length < 10) {
      setIsEnd(true);
    }
  };

  useEffect(() => {
    areMorePost();
  }, [morePost])

  return (
    <main className={styles["blog-page"]}>
      <Head>
        <title>Publicaciones</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {post?.map((doc: any) => {
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
      <div>
        {isEnd ? (
          <p className={styles["no-more-post"]}>¡No hay más publicaciones!</p>
        ) : loading ? (
          <Loader />
        ) : (
          <button onClick={fetchPost} className={styles["more-post"]}>
            Más publicaciones
          </button>
        )}
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const publicaciones = await supabase
    .from("publicación")
    .select(
      `id, creado_en, titulo, contenido, actualizado_en, id_imagen(enlace)`
    )
    .order("creado_en", { ascending: false })
    .range(0, 9);

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
