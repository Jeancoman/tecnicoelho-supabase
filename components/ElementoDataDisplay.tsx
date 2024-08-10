import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import Pagination from "./Pagination";
import { Elemento, ModalProps } from "../types";
import TicketService from "../utilities/ticketService";
import debounce from "lodash.debounce";

const Modal = ({ isOpen, closeModal, elemento }: ModalProps) => {
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
        <h3>{elemento?.nombre}</h3>
        {elemento?.estado === "ACTIVO" ? (
          <div className={styles["status-green"]}>Activo</div>
        ) : (
          <div className={styles["status-gray"]}>Inactivo</div>
        )}
      </div>
      <div className={styles["information"]}>
        <h4>Descripción</h4>
        <p>{elemento?.descripción}</p>
      </div>
    </dialog>
  );
};

const ElementoDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [currentElemento, setCurrentElemento] = useState<Elemento>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (search === "") {
      TicketService.getAllElementos(page, 8).then((data) => {
        setElementos(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      });
    } else {
      searchElements(search);
    }
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchElements = useCallback(
    debounce(async (search: string) => {
      const data = await TicketService.getAllElementosByNombre(page, 8, search);
      if (data?.rows?.length === 0) {
        const otherData = await TicketService.getAllElementosByDescripcion(
          page,
          8,
          search
        );

        if (otherData?.rows?.length === 0) {
          setElementos(otherData?.rows || []);
        } else {
          setElementos(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setElementos(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setLoading(false);
  }, [elementos]);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div
          className={styles["back-two"]}
          style={{
            height: "42px",
          }}
        >
          <span>Dashboard</span> <img src="/chevron_right.svg" />{" "}
          <span>Elementos</span>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className={styles["data-container"]}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && elementos.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    fontStyle: "italic",
                    paddingTop: "10px",
                  }}
                >
                  No se encontraron datos que mostrar
                </td>
              </tr>
            )}
            {!loading &&
              elementos.map((elemento) => {
                return (
                  <tr key={elemento.id}>
                    <td>{elemento.nombre}</td>
                    <td>{elemento.descripción}</td>
                    {elemento.estado === "ACTIVO" ? (
                      <td className={styles["status-green"]}>Activo</td>
                    ) : (
                      <td className={styles["status-gray"]}>Inactivo</td>
                    )}
                    <td>{elemento.registrado?.slice(0, 10)}</td>
                    <td className={styles["button-cell"]}>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setCurrentElemento(elemento);
                        }}
                      >
                        <p>Mostrar más</p>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {loading && <div className={styles.loader}></div>}
      </div>
      <div className={styles["last-row"]}>
        <Pagination
          pages={pages}
          current={current}
          next={() => {
            if (current < pages && current !== pages) {
              setPage(page + 1);
            }
          }}
          prev={() => {
            if (current > 1) {
              setPage(page - 1);
            }
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        closeModal={() => {
          setIsOpen(false);
        }}
        elemento={currentElemento}
      />
    </div>
  );
};

export default ElementoDataDisplay;
