import styles from "../styles/Checkboxes.module.css";

type Checkbox = {
  title: string;
};

const Checkbox = ({ title }: Checkbox) => {
  return (
    <div className={styles.checkbox}>
      <input type="checkbox" name={title} id={title} />
      <label htmlFor={title}>{title}</label>
    </div>
  );
};

export default Checkbox;
