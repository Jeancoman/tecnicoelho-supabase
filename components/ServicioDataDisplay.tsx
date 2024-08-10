import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/DataDisplay.module.css";
import Pagination from "./Pagination";
import { ModalProps, Selected, Servicio } from "../types";
import { useRouter } from "next/router";
import TicketService from "../utilities/ticketService";
import debounce from "lodash.debounce";
import Select from "./Search";
import Link from "next/link";

const Modal = ({ isOpen, closeModal, servicio }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [sP, setSP] = useState(0);
  const [sI, setSI] = useState(0);
  const [sC, setSC] = useState(0);

  useEffect(() => {
    if (servicio) {
      TicketService.getAllOperationsCountByState(
        "PENDIENTE",
        servicio?.ticket_id!,
        servicio?.id!
      ).then((data) => {
        setSP(data);
      });

      TicketService.getAllOperationsCountByState(
        "INICIADA",
        servicio?.ticket_id!,
        servicio?.id!
      ).then((data) => {
        setSI(data);
      });

      TicketService.getAllOperationsCountByState(
        "COMPLETADA",
        servicio?.ticket_id!,
        servicio?.id!
      ).then((data) => {
        setSC(data);
      });
    }
  }, [servicio]);

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
        <h3>{servicio?.nombre}</h3>
        {servicio?.estado === "INICIADO" ? (
          <div className={styles["status-purple"]}>Iniciado</div>
        ) : servicio?.estado === "COMPLETADO" ? (
          <div className={styles["status-green"]}>Completado</div>
        ) : (
          <div className={styles["status-gray"]}>Pendiente</div>
        )}
      </div>
      <div>
        <h4>Operaciones</h4>
        <div className={styles.row}>
          <Link
            href={
              "/portal/dashboard/tickets/" +
              (servicio?.ticket_id || "0") +
              "/servicios/" +
              (servicio?.id || "0") +
              "/operaciones?mostrar=completadas"
            }
          >
            <div className={styles["green-box"]}>
              <p>Completadas</p>
              <p> {sC >= 10 ? sC : "0" + sC}</p>
            </div>
          </Link>
          <Link
            href={
              "/portal/dashboard/tickets/" +
              (servicio?.ticket_id || "0") +
              "/servicios/" +
              (servicio?.id || "0") +
              "/operaciones?mostrar=iniciadas"
            }
          >
            <div className={styles["purple-box"]}>
              <p>Iniciadas</p>
              <p> {sI >= 10 ? sI : "0" + sI}</p>
            </div>
          </Link>
          <Link
            href={
              "/portal/dashboard/tickets/" +
              (servicio?.ticket_id || "0") +
              "/servicios/" +
              (servicio?.id || "0") +
              "/operaciones?mostrar=pendientes"
            }
          >
            <div className={styles["gray-box"]}>
              <p>Pendientes</p>
              <p> {sP >= 10 ? sP : "0" + sP}</p>
            </div>
          </Link>
          <Link
            href={
              "/portal/dashboard/tickets/" +
              (servicio?.ticket_id || "0") +
              "/servicios/" +
              (servicio?.id || "0") +
              "/operaciones?mostrar=todas"
            }
          >
            <div className={styles["normal-box"]}>
              <p>Totales</p>
              <p> {sC + sI + sP >= 10 ? sC + sI + sP : "0" + (sC + sI + sP)}</p>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles["information"]}>
        <h4>Descripción</h4>
        <p>{servicio?.descripción}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Necesidades</h4>
        <p>{servicio?.necesidades}</p>
      </div>
      <div className={styles["information"]}>
        <h4>Notas</h4>
        <p>{servicio?.notas}</p>
      </div>
    </dialog>
  );
};

const ServicioDataDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [currentServicio, setCurrentServicio] = useState<Servicio>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [queryType, setQueryType] = useState<Selected>({
    value:
      router.query.mostrar === "completados"
        ? "completados"
        : router.query.mostrar === "iniciados"
        ? "iniciados"
        : router.query.mostrar === "pendientes"
        ? "pendientes"
        : "todos",
    label:
      router.query.mostrar === "completados"
        ? "Completados"
        : router.query.mostrar === "iniciados"
        ? "Iniciados"
        : router.query.mostrar === "pendientes"
        ? "Pendientes"
        : "Todos",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (router.isReady && search === "") {
      switch (router.query.mostrar) {
        case "todos":
          TicketService.getAllServicios(
            router.query.id as string,
            page,
            8
          ).then((data) => {
            setServicios(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "pendientes":
          TicketService.getAllServiciosByState(
            router.query.id as string,
            "PENDIENTE",
            page,
            8
          ).then((data) => {
            setServicios(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "iniciados":
          TicketService.getAllServiciosByState(
            router.query.id as string,
            "INICIADO",
            page,
            8
          ).then((data) => {
            setServicios(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        case "completados":
          TicketService.getAllServiciosByState(
            router.query.id as string,
            "COMPLETADO",
            page,
            8
          ).then((data) => {
            setServicios(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
          break;
        default:
          TicketService.getAllServicios(
            router.query.id as string,
            page,
            8
          ).then((data) => {
            setServicios(data?.rows || []);
            setPages(data?.pages || 0);
            setCurrent(data?.current || 0);
          });
      }
    } else if (router.isReady) {
      switch (router.query.mostrar) {
        case "todos":
          searchServicios(search);
          break;
        case "pendientes":
          searchServiciosByState(search, "PENDIENTE");
          break;
        case "iniciados":
          searchServiciosByState(search, "INICIADO");
          break;
        case "completados":
          searchServiciosByState(search, "COMPLETADO");
          break;
        default:
          searchServicios(search);
      }
    }
  }, [router.isReady, search, page, router.query.mostrar]);

  useEffect(() => {
    setPage(1);
  }, [search, router.query.mostrar]);

  const searchServicios = useCallback(
    debounce(async (search: string) => {
      const data = await TicketService.getAllServiciosByNombre(
        router.query.id as string,
        page,
        8,
        search
      );
      if (data?.rows?.length === 0) {
        const otherData = await TicketService.getAllServiciosByDescripcion(
          router.query.id as string,
          page,
          8,
          search
        );

        if (otherData?.rows?.length === 0) {
          setServicios(otherData?.rows || []);
        } else {
          setServicios(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setServicios(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  const searchServiciosByState = useCallback(
    debounce(async (search: string, state: string) => {
      const data = await TicketService.getAllServiciosByNombreAndState(
        router.query.id as string,
        page,
        8,
        search,
        state
      );
      if (data?.rows?.length === 0) {
        const otherData =
          await TicketService.getAllServiciosByDescripcionAndState(
            router.query.id as string,
            page,
            8,
            search,
            state
          );

        if (otherData?.rows?.length === 0) {
          setServicios(otherData?.rows || []);
        } else {
          setServicios(otherData?.rows || []);
          setPages(data?.pages || 0);
          setCurrent(data?.current || 0);
        }
      } else {
        setServicios(data?.rows || []);
        setPages(data?.pages || 0);
        setCurrent(data?.current || 0);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    setLoading(false);
  }, [servicios]);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.back}>
          <span>TID-{router.query.id || ""}</span>{" "}
          <img src="/chevron_right.svg" /> <span>Servicios</span>
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
                  value: "iniciados",
                  label: "Iniciados",
                  onClick: (value, label) => {
                    setQueryType({
                      value,
                      label,
                    });
                  },
                },
                {
                  value: "completados",
                  label: "Completados",
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
              <th>Tipo</th>
              <th>Estado</th>
              <th>Añadido</th>
              <th>Iniciado</th>
              <th>Completado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && servicios.length === 0 && (
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
              servicios.map((servicio) => {
                return (
                  <tr key={servicio.id}>
                    <td>{servicio.nombre}</td>
                    {servicio.tipo === "DOMICILIO" ? (
                      <td>A domicilio</td>
                    ) : servicio.tipo === "TIENDA" ? (
                      <td>En tienda</td>
                    ) : (
                      <td>Remoto</td>
                    )}
                    {servicio.estado === "PENDIENTE" ? (
                      <td className={styles["status-gray"]}>Pendiente</td>
                    ) : servicio.estado === "INICIADO" ? (
                      <td className={styles["status-purple"]}>Iniciado</td>
                    ) : (
                      <td className={styles["status-green"]}>Completado</td>
                    )}
                    <td>{servicio.añadido?.slice(0, 10)}</td>
                    <td>{servicio.iniciado?.slice(0, 10)}</td>
                    <td>{servicio.completado?.slice(0, 10)}</td>
                    <td className={styles["button-cell"]}>
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setCurrentServicio(servicio);
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
        servicio={currentServicio}
      />
    </div>
  );
};

export default ServicioDataDisplay;
