import styles from "../styles/Pagination.module.css";

const Pagination = () => {
  return (
    <div className={styles.button}>
      <div className={styles.left}>
        <img src="/arrow_back.svg" />
      </div>
      <div>
        <span>1</span>
        {"/"}
        <span>2</span>
      </div>
      <div className={styles.right}>
        <img src="/arrow_forward.svg" />
      </div>
    </div>
  );
};

export default Pagination;
