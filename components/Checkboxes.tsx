import { Key } from "react";
import Checkbox from "./Checkbox";
import styles from "../styles/Checkboxes.module.css";

type Checkboxes = {
    categories : string[];
}

const Checkboxes = ({ categories }: Checkboxes ) => {
  return (
    <div className={styles.container}>
      {categories.map((data: string, index: Key | null | undefined) => {
        return <Checkbox title={data} key={index} />;
      })}
    </div>
  );
};

export default Checkboxes;
