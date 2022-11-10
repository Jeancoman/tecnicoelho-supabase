import Link from "next/link";
import styles from "../styles/Product.module.css";

const Product = ({ image, title, price, id }: any) => {
  return (
    <Link href={"/productos/" + id}>
    <div className={styles.container}>
      <picture className={styles.image}>
        <source srcSet={image} width="200" height="200" />
        <img src={image} alt="Product" />
      </picture>
      <hr />
      <div className={styles.information}>
        <div className={styles.price}>USD {price}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
    </Link>
  );
};

export default Product;
