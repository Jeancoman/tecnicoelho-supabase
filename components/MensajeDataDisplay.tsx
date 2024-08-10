import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import Pagination from "./Pagination";
import { Mensaje, ModalProps, Selected } from "../types";
import { useRouter } from "next/router";
import TicketService from "../utilities/ticketService";
import debounce from "lodash.debounce";
import Select from "./Search";

const Modal = ({ isOpen, closeModal, mensaje }: ModalProps) => {
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
        {mensaje?.estado === "ENVIADO" ? (
          <div className={styles["status-green"]}>Enviado</div>
        ) : (
          <div className={styles["status-gray"]}>No enviado</div>
        )}
      </div>
      <div className={styles["information"]}>
        <h4>Contenido</h4>
        <p>{mensaje?.contenido}</p>
      </div>
    </dialog>
  );
};

const MensajeDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [currentMensaje, setCurrentMensaje] = useState<Mensaje>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [queryType, setQueryType] = useState<Selected>({
    value:
      router.query.mostrar === "no-enviados"
        ? "no-enviados"
        : router.query.mostrar === "enviados"
        ? "enviados"
        : "todos",
    label:
      router.query.mostrar === "no-enviados"
        ? "No enviados"
        : router.query.mostrar === "enviados"
        ? "Enviados"
        : "Todos",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (router.isReady && search === "") {
      switch (router.query.mostrar) {
        case "todos":
          TicketService.getAllMensajes(router.query.id as string, page, 8).then(
            (data) => {
              setMensajes(data?.rows || []);
              setPages(data?.pages || 0);
              setCurrent(data?.current || 0);
            }
          );
          break;
        case "enviados":
          TicketService.getAllMensajesByState(
            router.query.id as string,
            "ENVIADO",
            page,
            8
          ).then((data) => {
            setMensajes(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "no-enviados":
          TicketService.getAllMensajesByState(
            router.query.id as string,
            "NO_ENVIADO",
            page,
            8
          ).then((data) => {
            setMensajes(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        default:
          TicketService.getAllMensajes(router.query.id as string, page, 8).then(
            (data) => {
              setMensajes(data?.rows || []);
              setPages(data?.pages || 0);
              setCurrent(data?.current || 0);
            }
          );
      }
    } else if (router.isReady) {
      switch (router.query.mostrar) {
        case "todos":
          searchMensajes(search);
          break;
        case "enviados":
          searchMensajesByState(search, "ENVIADO");
          break;
        case "no-enviados":
          searchMensajesByState(search, "NO_ENVIADO");
          break;
        default:
          searchMensajes(search);
      }
    }
  }, [router.isReady, page, search, router.query.mostrar]);

  useEffect(() => {
    setPage(1);
  }, [search, router.query.mostrar]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchMensajes = useCallback(
    debounce(async (search: string) => {
      const data = await TicketService.getAllMensajesByNombre(
        router.query.id as string,
        page,
        8,
        search
      );
      if (data?.rows?.length === 0) {
        const otherData = await TicketService.getAllMensajesByDescripcion(
          router.query.id as string,
          page,
          8,
          search
        );

        if (otherData?.rows?.length === 0) {
          setMensajes(otherData?.rows || []);
        } else {
          setMensajes(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setMensajes(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  const searchMensajesByState = useCallback(
    debounce(async (search: string, state: string) => {
      const data = await TicketService.getAllMensajesByNombreAndState(
        router.query.id as string,
        page,
        8,
        search,
        state
      );
      if (data?.rows?.length === 0) {
        const otherData =
          await TicketService.getAllMensajesByDescripcionAndState(
            router.query.id as string,
            page,
            8,
            search,
            state
          );

        if (otherData?.rows?.length === 0) {
          setMensajes(otherData?.rows || []);
        } else {
          setMensajes(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setMensajes(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setLoading(false);
  }, [mensajes]);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.back}>
          <span>TID-{router.query.id || ""}</span>{" "}
          <img src="/chevron_right.svg" /> <span>Mensajes</span>
        </div>
        <div>
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              width: "140px",
              height: "44px",
            }}
          >
            <Select
              options={[
                {
                  value: "todos",
                  label: "Todos",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
                {
                  value: "enviados",
                  label: "Enviados",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
                {
                  value: "no-enviados",
                  label: "No enviados",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
              ]}
              selected={queryType}
              onChange={() => {
                router.replace({
                  query: {
                    mostrar: queryType.value,
                    id: router.query.id,
                  },
                });
              }}
            />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles["data-container"]}>
        <table>
          <thead>
            <tr>
              <th>Contenido</th>
              <th>Estado</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && mensajes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
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
              mensajes.map((mensaje) => {
                return (
                  <tr key={mensaje.id}>
                    <td>{mensaje.contenido}</td>
                    {mensaje.estado === "ENVIADO" ? (
                      <td className={styles["status-green"]}>Enviado</td>
                    ) : (
                      <td className={styles["status-gray"]}>No enviado</td>
                    )}
                    <td>{mensaje.creado?.slice(0, 10)}</td>
                    <td className={styles["button-cell"]}>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setCurrentMensaje(mensaje);
                        }}
                      >
                        <p>Más</p>
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
        mensaje={currentMensaje}
      />
    </div>
  );
};

export default MensajeDataDisplay;
