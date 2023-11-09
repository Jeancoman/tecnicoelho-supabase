import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import BlogFeed from "../../components/BlogFeed";
import Loader from "../../components/Loader";
import styles from "/styles/Blog.module.css";
import PublicationService from "../../utilities/publicationService";
import { Publicación } from "../types";

const Blog: NextPage = ({ data }: any) => {
  const [post, setPost] = useState<Publicación[]>(data.rows || []);
  const [page, setPage] = useState(data.current);
  const [pages] = useState(data.pages);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const fetchPost = async () => {
    setLoading(true)
    const data = await PublicationService.getAll(page + 1, 9);
    setPage(page + 1);

    if(data){
      setPost(post.concat(data.rows));
    }
    setLoading(false)
  };

  const areMorePost = () => {
    if (post.length < 9) {
      setIsEnd(true);
    }
    if (page === pages) {
      setIsEnd(true);
    }
  };

  useEffect(() => {
    areMorePost();
  }, [page])

  return (
    <main className={styles["blog-page"]}>
      <Head>
        <title>Publicaciones</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {post?.map((doc) => {
        return (
          <BlogFeed
            fecha={doc.creada}
            imagen={doc.imagen?.url || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"}
            contenido={doc.contenido}
            titulo={doc.título}
            key={doc.id}
            id={doc.slug}
          />
        );
      })}
      <div>
        {isEnd  ? (
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

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await PublicationService.getAll(1,9)

  return {
    props: {
      data,
    },
  };
};

export default Blog;
