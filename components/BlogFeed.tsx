import Link from "next/link";
import styles from "../styles/BlogFeed.module.css";

const BlogFeed = ({ fecha, imagen, contenido, titulo, id }: any) => {
  return (
    <div className={styles.container}>
      <div>
        <picture>
          <source srcSet={imagen} />
          <img src={imagen} alt="Perfil" referrerPolicy="no-referrer" />
        </picture>
      </div>
      <div className={styles.preview}>
        <div className={styles.fecha}>{fecha.slice(0, 10)}</div>
        <Link href={"/blog/" + id}>
        <p className={styles.titulo}>{titulo}</p>
        </Link>
      </div>
    </div>
  );
};

export default BlogFeed;
