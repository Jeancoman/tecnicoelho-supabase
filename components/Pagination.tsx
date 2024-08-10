import styles from "../styles/Pagination.module.css";
import { PaginationProps } from "../types";

const Pagination = ({ current, pages, next, prev }: PaginationProps) => {
  return (
    <div className={styles.button}>
      <div
        className={styles.left}
        onClick={prev}
        style={{
          pointerEvents: current > 1 ? "auto" : "none",
        }}
      >
        <img src="/arrow_back.svg" />
      </div>
      <div>
        <span>{current === 0 ? 1 : current}</span>
        {"/"}
        <span>{pages === 0 ? 1 : pages}</span>
      </div>
      <div
        className={styles.right}
        onClick={next}
        style={{
          pointerEvents: current < pages && current !== pages ? "auto" : "none",
        }}
      >
        <img src="/arrow_forward.svg" />
      </div>
    </div>
  );
};

export default Pagination;
