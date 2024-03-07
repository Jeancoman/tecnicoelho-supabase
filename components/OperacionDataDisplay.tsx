import { useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import { ModalProps } from "../types";
import Pagination from "./Pagination";

const Modal = ({ isOpen, closeModal }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeModal();
          ref.current?.close();
        }
      });
    } else {
      closeModal();
      ref.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        const dialogDimensions = ref.current?.getBoundingClientRect()!;
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          closeModal();
          ref.current?.close();
        }
      }}
      className={styles.modal}
    >
      <div className={styles["modal-first-row"]}>
        <h3>Retirar FLEX de la pantalla</h3>
        <div>Pendiente</div>
      </div>
      <div className={styles["information"]}>
        <h4>Descripción</h4>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim hic
          optio quia nobis recusandae vitae, deserunt mollitia nulla expedita
          iste accusantium fugit repudiandae aperiam id voluptatem? Quaerat
          repudiandae ab labore?
        </p>
      </div>
      <div className={styles["information"]}>
        <h4>Necesidades</h4>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim hic
          optio quia nobis recusandae vitae, deserunt mollitia nulla expedita
          iste accusantium fugit repudiandae aperiam id voluptatem? Quaerat
          repudiandae ab labore? Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Enim hic optio quia nobis recusandae vitae, deserunt
          mollitia nulla expedita iste accusantium fugit repudiandae aperiam id
          voluptatem? Quaerat repudiandae ab labore?
        </p>
      </div>
      <div className={styles["information"]}>
        <h4>Resultado</h4>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim hic
          optio quia nobis recusandae vitae, deserunt mollitia nulla expedita
          iste accusantium fugit repudiandae aperiam id voluptatem? Quaerat
          repudiandae ab labore?
        </p>
      </div>
      <div className={styles["information"]}>
        <h4>Notas</h4>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim hic
          optio quia nobis recusandae vitae, deserunt mollitia nulla expedita
          iste accusantium fugit repudiandae aperiam id voluptatem? Quaerat
          repudiandae ab labore?
        </p>
      </div>
    </dialog>
  );
};

const OperacionDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.back}>
          <span>TID-1</span> <img src="/chevron_right.svg" />{" "}
          <span className={styles["second-cursor"]}>Servicios</span>{" "}
          <img src="/chevron_right.svg" /> 1 <img src="/chevron_right.svg" />{" "}
          <span>Operaciones</span>
        </div>
        <input type="text" placeholder="Buscar operación..." />
      </div>
      <div className={styles["data-container"]}>
        <table>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Añadida</th>
            <th>Iniciada</th>
            <th>Completada</th>
            <th></th>
          </tr>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>Germany</td>
            <td>Germany</td>
            <td className={styles["button-cell"]}>
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <p>Más</p>
              </button>
            </td>
          </tr>
        </table>
      </div>
      <div className={styles["last-row"]}>
        <Pagination />
      </div>
      <Modal
        isOpen={isOpen}
        closeModal={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default OperacionDataDisplay;
