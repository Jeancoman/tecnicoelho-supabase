import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import Pagination from "./Pagination";
import { ModalProps, Problema, Selected } from "../types";
import { useRouter } from "next/router";
import TicketService from "../utilities/ticketService";
import debounce from "lodash.debounce";
import Select from "./Search";
import { useMediaQuery } from "react-responsive";

const Modal = ({ isOpen, closeModal, problema }: ModalProps) => {
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
        <h3>{problema?.nombre}</h3>
        {problema?.estado === "PENDIENTE" ? (
          <div className={styles["status-gray"]}>Pendiente</div>
        ) : (
          <div className={styles["status-green"]}>Resuelto</div>
        )}
        {problema?.prioridad === "ALTA" ? (
          <div className={styles["status-red"]}>Alta</div>
        ) : problema?.prioridad === "MEDIA" ? (
          <div className={styles["status-yellow"]}>Media</div>
        ) : (
          <div className={styles["status-green"]}>Baja</div>
        )}
      </div>
      <div className={styles["information"]}>
        <h4>Descripción</h4>
        <p>{problema?.descripción}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Causa</h4>
        <p>{problema?.causa}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Solución</h4>
        <p>{problema?.solución}</p>
      </div>
    </dialog>
  );
};

const ProblemaDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [currentProblema, setCurrentProblema] = useState<Problema>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [queryType, setQueryType] = useState<Selected>({
    value:
      router.query.mostrar === "resueltos"
        ? "resueltos"
        : router.query.mostrar === "pendientes"
        ? "pendientes"
        : "todos",
    label:
      router.query.mostrar === "resueltos"
        ? "Resueltos"
        : router.query.mostrar === "pendientes"
        ? "Pendientes"
        : "Todos",
  });
  const [loading, setLoading] = useState(true);
  const isAbove750 = useMediaQuery({ minWidth: 750 });
  const isAbove610 = useMediaQuery({ minWidth: 610 });

  useEffect(() => {
    setLoading(true);
    if (router.isReady && search === "") {
      switch (router.query.mostrar) {
        case "todos":
          TicketService.getAllProblemas(
            router.query.id as string,
            page,
            8
          ).then((data) => {
            setProblemas(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "pendientes":
          TicketService.getAllProblemasByState(
            router.query.id as string,
            "PENDIENTE",
            page,
            8
          ).then((data) => {
            setProblemas(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "resueltos":
          TicketService.getAllProblemasByState(
            router.query.id as string,
            "RESUELTO",
            page,
            8
          ).then((data) => {
            setProblemas(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        default:
          TicketService.getAllProblemas(
            router.query.id as string,
            page,
            8
          ).then((data) => {
            setProblemas(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
      }
    } else if (router.isReady) {
      switch (router.query.mostrar) {
        case "todos":
          searchProblemas(search);
          break;
        case "pendientes":
          searchProblemasByState(search, "PENDIENTE");
          break;
        case "resueltos":
          searchProblemasByState(search, "RESUELTO");
          break;
        default:
          searchProblemas(search);
      }
    }
  }, [router.isReady, router.query.mostrar, page, search]);

  useEffect(() => {
    setPage(1);
  }, [search, router.query.mostrar]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchProblemas = useCallback(
    debounce(async (search: string) => {
      const data = await TicketService.getAllProblemasByNombre(
        router.query.id as string,
        page,
        8,
        search
      );

      if (data?.rows?.length === 0) {
        const otherData = await TicketService.getAllProblemasByDescripcion(
          router.query.id as string,
          page,
          8,
          search
        );

        if (otherData?.rows?.length === 0) {
          setProblemas(otherData?.rows || []);
        } else {
          setProblemas(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setProblemas(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  const searchProblemasByState = useCallback(
    debounce(async (search: string, state: string) => {
      const data = await TicketService.getAllProblemasByNombreAndState(
        router.query.id as string,
        page,
        8,
        search,
        state
      );
      if (data?.rows?.length === 0) {
        const otherData =
          await TicketService.getAllProblemasByDescripcionAndState(
            router.query.id as string,
            page,
            8,
            search,
            state
          );

        if (otherData?.rows?.length === 0) {
          setProblemas(otherData?.rows || []);
        } else {
          setProblemas(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setProblemas(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setLoading(false);
  }, [problemas]);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.back}>
          <span>TID-{router.query.id || ""}</span>{" "}
          <img src="/chevron_right.svg" /> <span>Problemas</span>
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
                  value: "resueltos",
                  label: "Resueltos",
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
              <th>Nombre</th>
              <th>Estado</th>
              {isAbove610 && (
                <>
                  <th>Prioridad</th>
                </>
              )}
              {isAbove750 && (
                <>
                  <th>Detectado</th>
                  <th>Resuelto</th>
                </>
              )}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && problemas.length === 0 && (
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
              problemas.map((problema) => {
                return (
                  <tr key={problema.id}>
                    <td>{problema.nombre}</td>
                    {problema.estado === "PENDIENTE" ? (
                      <td className={styles["status-gray"]}>Pendiente</td>
                    ) : (
                      <td className={styles["status-green"]}>Resuelto</td>
                    )}
                    {isAbove610 && (
                      <>
                        {problema.prioridad === "ALTA" ? (
                          <td className={styles["status-red"]}>Alta</td>
                        ) : problema.prioridad === "MEDIA" ? (
                          <td className={styles["status-yellow"]}>Media</td>
                        ) : (
                          <td className={styles["status-green"]}>Baja</td>
                        )}
                      </>
                    )}
                    {isAbove750 && (
                      <>
                        <td>{problema.detectado?.slice(0, 10)}</td>
                        <td>{problema.resuelto?.slice(0, 10)}</td>
                      </>
                    )}
                    <td className={styles["button-cell"]}>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setCurrentProblema(problema);
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
        problema={currentProblema}
      />
    </div>
  );
};

export default ProblemaDataDisplay;
