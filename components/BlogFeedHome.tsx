import Link from "next/link";
import styles from "../styles/BlogFeedHome.module.css";

const BlogFeed = ({ fecha, imagen, contenido, titulo, id }: any) => {
  return (
    <div className={styles.container}>
      <div>
        <Link href={"/blog/" + id}>
          <picture>
            <source srcSet={imagen} />
            <img src={imagen} alt="Perfil" referrerPolicy="no-referrer" />
          </picture>
        </Link>
      </div>
      <div className={styles.preview}>
        <div className={styles.fecha}>{fecha}</div>
        <Link href={"/blog/" + id}>
          <p className={styles.titulo}>{titulo}</p>
        </Link>
      </div>
    </div>
  );
};

export default BlogFeed;
