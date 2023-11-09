import { GetServerSideProps, NextPage } from "next";
import styles from "/styles/BlogPost.module.css";
import markdown from "/styles/Markdown.module.css";
import Head from "next/head";
import PublicationService from "../../../utilities/publicationService";
import { useState } from "react";
import { Publicación } from "../../types";

const Post: NextPage = ({ data }: any) => {
  const [post] = useState<Publicación>(data)
  
  return (
    <main className={styles.main}>
      <Head>
        <title>{post.título}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        <div>
          <picture>
            <source srcSet={post.imagen?.url || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"} />
            <img
              src={post.imagen?.url || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"}
              alt="Perfil"
              referrerPolicy="no-referrer"
            />
          </picture>
        </div>
        <div className={styles.preview}>
          <div className={styles.fecha}>Fecha de creación: {String(post?.creada).slice(0, 10)}</div>
          <div className={styles.titulo}>{post.título}</div>
          <article className={markdown["markdown-body"]} dangerouslySetInnerHTML={{__html: post?.contenido}} />
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }: any) => {
  const data = await PublicationService.getBySlug(params.id);

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
