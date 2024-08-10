import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import { ModalProps, Operación, Selected } from "../types";
import Pagination from "./Pagination";
import TicketService from "../utilities/ticketService";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import Select from "./Search";

const Modal = ({ isOpen, closeModal, operación }: ModalProps) => {
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
        <h3>{operación?.nombre}</h3>
        {operación?.estado === "INICIADA" ? (
          <div className={styles["status-purple"]}>Iniciada</div>
        ) : operación?.estado === "COMPLETADA" ? (
          <div className={styles["status-green"]}>Completada</div>
        ) : (
          <div className={styles["status-gray"]}>Pendiente</div>
        )}
      </div>
      <div className={styles["information"]}>
        <h4>Descripción</h4>
        <p>{operación?.descripción}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Necesidades</h4>
        <p>{operación?.necesidades}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Resultado</h4>
        <p>{operación?.resultado}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Notas</h4>
        <p>{operación?.notas}</p>
      </div>
    </dialog>
  );
};

const OperacionDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [operaciones, setOperaciones] = useState<Operación[]>([]);
  const [currentOperación, setCurrentOperación] = useState<Operación>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [queryType, setQueryType] = useState<Selected>({
    value:
      router.query.mostrar === "completadas"
        ? "completadas"
        : router.query.mostrar === "iniciadas"
        ? "iniciadas"
        : router.query.mostrar === "pendientes"
        ? "pendientes"
        : "todas",
    label:
      router.query.mostrar === "completadas"
        ? "Completadas"
        : router.query.mostrar === "iniciadas"
        ? "Iniciadas"
        : router.query.mostrar === "pendientes"
        ? "Pendientes"
        : "Todas",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (router.isReady && search === "") {
      switch (router.query.mostrar) {
        case "todas":
          TicketService.getAllOperaciones(
            router.query.id as string,
            router.query.sid as string,
            page,
            8
          ).then((data) => {
            setOperaciones(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "pendientes":
          TicketService.getAllOperacionesByState(
            router.query.id as string,
            router.query.sid as string,
            "PENDIENTE",
            page,
            8
          ).then((data) => {
            setOperaciones(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "iniciadas":
          TicketService.getAllOperacionesByState(
            router.query.id as string,
            router.query.sid as string,
            "INICIADA",
            page,
            8
          ).then((data) => {
            setOperaciones(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "completadas":
          TicketService.getAllOperacionesByState(
            router.query.id as string,
            router.query.sid as string,
            "COMPLETADA",
            page,
            8
          ).then((data) => {
            setOperaciones(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        default:
          TicketService.getAllOperaciones(
            router.query.id as string,
            router.query.sid as string,
            page,
            8
          ).then((data) => {
            setOperaciones(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
      }
    } else if (router.isReady) {
      switch (router.query.mostrar) {
        case "todas":
          searchOperaciones(search);
          break;
        case "pendientes":
          searchOperacionesByState(search, "PENDIENTE");
          break;
        case "iniciadas":
          searchOperacionesByState(search, "INICIADA");
          break;
        case "completadas":
          searchOperacionesByState(search, "COMPLETADA");
          break;
        default:
          searchOperaciones(search);
      }
    }
  }, [router.isReady, page, search, router.query.mostrar]);

  useEffect(() => {
    setPage(1);
  }, [search, router.query.mostrar]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchOperaciones = useCallback(
    debounce(async (search: string) => {
      const data = await TicketService.getAllOperacionesByNombre(
        router.query.id as string,
        router.query.sid as string,
        page,
        8,
        search
      );
      if (data?.rows?.length === 0) {
        const otherData = await TicketService.getAllOperacionesByDescripcion(
          router.query.id as string,
          router.query.sid as string,
          page,
          8,
          search
        );

        if (otherData?.rows?.length === 0) {
          setOperaciones(otherData?.rows || []);
        } else {
          setOperaciones(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setOperaciones(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  const searchOperacionesByState = useCallback(
    debounce(async (search: string, state: string) => {
      const data = await TicketService.getAllOperacionesByNombreAndState(
        router.query.id as string,
        router.query.sid as string,
        page,
        8,
        search,
        state
      );
      if (data?.rows?.length === 0) {
        const otherData =
          await TicketService.getAllOperacionesByDescripcionAndState(
            router.query.id as string,
            router.query.sid as string,
            page,
            8,
            search,
            state
          );

        if (otherData?.rows?.length === 0) {
          setOperaciones(otherData?.rows || []);
        } else {
          setOperaciones(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setOperaciones(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setLoading(false);
  }, [operaciones]);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.back}>
          <span>TID-{router.query.id || ""}</span>{" "}
          <img src="/chevron_right.svg" />{" "}
          <span className={styles["second-cursor"]}>Servicios</span>{" "}
          <img src="/chevron_right.svg" />
          {router.query.sid || ""} <img src="/chevron_right.svg" />{" "}
          <span>Operaciones</span>
        </div>
        <div>
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              width: "148px",
              height: "44px",
            }}
          >
            <Select
              options={[
                {
                  value: "todas",
                  label: "Todas",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
                {
                  value: "pendientes",
                  label: "Pendientes",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
                {
                  value: "iniciadas",
                  label: "Iniciadas",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
                {
                  value: "completadas",
                  label: "Completadas",
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
                    sid: router.query.sid,
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
              <th>Nombre</th>
              <th>Estado</th>
              <th>Añadida</th>
              <th>Iniciada</th>
              <th>Completada</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && operaciones.length === 0 && (
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
              operaciones.map((operación) => {
                return (
                  <tr key={operación.id}>
                    <td>{operación.nombre}</td>
                    {operación.estado === "PENDIENTE" ? (
                      <td className={styles["status-gray"]}>Pendiente</td>
                    ) : operación.estado === "INICIADA" ? (
                      <td className={styles["status-purple"]}>Iniciada</td>
                    ) : (
                      <td className={styles["status-green"]}>Completada</td>
                    )}
                    <td>{operación.añadida?.slice(0, 10)}</td>
                    <td>{operación.iniciada?.slice(0, 10)}</td>
                    <td>{operación.completada?.slice(0, 10)}</td>
                    <td className={styles["button-cell"]}>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setCurrentOperación(operación);
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
        operación={currentOperación}
      />
    </div>
  );
};

export default OperacionDataDisplay;
