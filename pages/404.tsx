import { NextPage } from "next";
import style from "../styles/404.module.css";

const FourOuFour: NextPage = () => {
  return (
    <main className={style["main"]}>
      <div>
        <h1>Página no encontrada</h1>
        <h2>404</h2>
      </div>
    </main>
  );
};

export default FourOuFour;
