import { useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import Pagination from "./Pagination";
import { ModalProps } from "../types";

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
        <div>Pendiente</div>
      </div>
      <div className={styles["information"]}>
        <h4>Contenido</h4>
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

const MensajeDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.back}>
          <span>TID-1</span> <img src="/chevron_right.svg" />{" "}
          <span>Mensajes</span>
        </div>
        <input type="text" placeholder="Buscar mensaje..." />
      </div>
      <div className={styles["data-container"]}>
        <table>
          <tr>
            <th>Contenido</th>
            <th>Estado</th>
            <th>Creado</th>
            <th></th>
          </tr>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
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

export default MensajeDataDisplay;
