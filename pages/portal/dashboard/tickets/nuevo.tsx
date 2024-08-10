import { NextPage } from "next";
import styles from "/styles/Portal.module.css";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import jwt_decode from "jwt-decode";
import {
  Categoría,
  Cliente,
  Elemento,
  JwtPayload,
  ModalProps,
  Problema,
  Selected,
  Ticket,
} from "../../../../types";
import session from "../../../../utilities/sessionService";
import TicketService from "../../../../utilities/ticketService";
import TicketElement from "../../../../components/TicketElement";
import Select from "../../../../components/SearchPortal";
import CategoryService from "../../../../utilities/categoryService";
import toast, { Toaster } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import FooterNavbar from "../../../../components/FooterNavbar";

const Modal = ({ isOpen, closeModal }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    TicketService.getAll().then((data) => {
      setTickets(data?.rows || []);
      setLoading(false);
    });
  }, []);

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
      <div className={styles["ticket-list-container-modal"]}>
        <input
          type="text"
          placeholder="Buscar ticket..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <hr />
        <div className={styles["ticket-list-modal"]}>
          {loading && <div className={styles.loader}></div>}
          {!loading && tickets.length === 0 && (
            <div className={styles["list-image-div"]}>
              <img
                src="/face-with-monocle.svg"
                alt="Down"
                referrerPolicy="no-referrer"
              />
              <h4>No se encontraron tickets</h4>
            </div>
          )}
          {search !== ""
            ? tickets
                .filter(
                  (ticket) =>
                    `TID-${ticket.id?.toString()}`.includes(search) ||
                    ticket.estado.includes(search) ||
                    ticket.notas_de_apertura?.slice(0, 10).includes(search)
                )
                .map((ticket) => {
                  return <TicketElement {...ticket} key={ticket.id} />;
                })
            : tickets.map((ticket) => {
                return <TicketElement {...ticket} key={ticket.id} />;
              })}
        </div>
      </div>
    </dialog>
  );
};

const Nuevo: NextPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Cliente>();
  const [newTicketData, setNewTicketData] = useState<{
    ticket: Ticket;
    elemento: Elemento;
    problema: Problema;
  }>({
    ticket: {
      estado: "ABIERTO",
    },
    elemento: {
      nombre: "",
      descripción: "",
      categoría_id: -1,
    },
    problema: {
      nombre: "",
      estado: "PENDIENTE",
      prioridad: "BAJA",
    },
  });
  const [categories, setCategories] = useState<Categoría[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Selected>({
    value: -1,
    label: "Seleccionar tipo de elemento*",
  });
  const [elements, setElements] = useState<Elemento[]>([]);
  const [selectedElement, setSelectedElement] = useState<Selected>({
    value: -1,
    label: "Seleccionar elemento inactivo",
  });
  const [disabled, setDisabled] = useState(false);
  const isAbove1075 = useMediaQuery({ minWidth: 1075 });
  const isBelow1075 = useMediaQuery({ maxWidth: 1074 });
  const isAbove495 = useMediaQuery({ minWidth: 495 });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    TicketService.getAll().then((data) => {
      setTickets(data?.rows || []);
      setLoading(false);
    });

    CategoryService.getAllDigitales().then((data) => {
      setCategories(data || []);
    });

    TicketService.getAllElementos(1, 10000).then((data) => {
      setElements(
        data?.rows.filter((elemento) => elemento.estado === "INACTIVO") || []
      );
    });
  }, []);

  useEffect(() => {
    if (!session.find()) {
      router.push("/portal/inicio");
    } else {
      setCurrent(jwt_decode<JwtPayload>(session.find()?.token!).cliente);
    }
  });

  return (
    <>
      <Head>
        <title>Portal</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        {isAbove1075 && (
          <aside className={styles["ticket-list-container"]}>
            <input
              type="text"
              placeholder="Buscar ticket..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <hr />
            <div className={styles["ticket-list"]}>
              {loading && <div className={styles.loader}></div>}
              {!loading && tickets.length === 0 && (
                <div className={styles["list-image-div"]}>
                  <img
                    src="/face-with-monocle.svg"
                    alt="Down"
                    referrerPolicy="no-referrer"
                  />
                  <h4>No se encontraron tickets</h4>
                </div>
              )}
              {search !== ""
                ? tickets
                    .filter(
                      (ticket) =>
                        `TID-${ticket.id?.toString()}`.includes(search) ||
                        ticket.estado.includes(search) ||
                        ticket.notas_de_apertura?.slice(0, 10).includes(search)
                    )
                    .map((ticket) => {
                      return <TicketElement {...ticket} key={ticket.id} />;
                    })
                : tickets.map((ticket) => {
                    return <TicketElement {...ticket} key={ticket.id} />;
                  })}
            </div>
          </aside>
        )}
        <nav className={styles.navbar}>
          <img
            onClick={() => {
              router.push("/");
            }}
            src="/Logo-TecniCoelho-sin-eslogan.png"
          />
          {isAbove495 && (
            <div className={styles.dropdown}>
              <div
                className={styles.user}
              >{`${current?.nombre} ${current?.apellido}`}</div>
              <div className={styles["dropdown-content"]}>
                <Link href={"/portal/dashboard/tickets/nuevo"}>
                  <div>
                    <img src="/confirmation_number.svg" />
                    Nuevo ticket
                  </div>
                </Link>
                {isBelow1075 && (
                  <div
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <img src="/list_alt.svg" />
                    Mis tickets
                  </div>
                )}
                <Link href={"/portal/dashboard/elementos"}>
                  <div>
                    <img src="/devices.svg" />
                    Mis elementos
                  </div>
                </Link>
                <div
                  onClick={() => {
                    session.revoke();
                    router.push("/portal/inicio");
                  }}
                >
                  <img src="/logout_portal.svg" />
                  Cerrar sesión
                </div>
              </div>
            </div>
          )}
        </nav>
        <main className={styles.display}>
          <div className={styles["other-container"]}>
            <div className={styles["first-row"]}>
              <div
                className={styles["back-two"]}
                style={{
                  height: "42px",
                }}
              >
                <span>Dashboard</span> <img src="/chevron_right.svg" />{" "}
                <span>Abrir ticket</span>
              </div>
            </div>
            <div className={styles["form-container"]}>
              <form>
                <div className={styles["elemento-half"]}>
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    {elements.length > 0 && (
                      <Select
                        options={elements.map((element) => ({
                          value: element.id,
                          label: element.nombre,
                          onClick: (value, label) => {
                            setSelectedElement({
                              value,
                              label,
                            });
                          },
                        }))}
                        selected={selectedElement}
                        onChange={() => {
                          setNewTicketData({
                            ...newTicketData,
                            elemento: {
                              ...newTicketData.elemento,
                              id: selectedElement.value! as number,
                              nombre: "",
                              descripción: "",
                              categoría_id: -1,
                            },
                          });
                          setSelectedCategory({
                            value: -1,
                            label: "Seleccionar tipo de elemento*",
                          });
                          setDisabled(true);
                        }}
                      />
                    )}
                    {elements.length === 0 && (
                      <input
                        type="text"
                        placeholder="Seleccionar elemento inactivo"
                        required
                        disabled
                      />
                    )}
                  </div>
                  <div className={styles.or}>
                    <hr />
                    <div>O</div>
                    <hr />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre de tu elemento*"
                      value={newTicketData.elemento.nombre}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          elemento: {
                            ...newTicketData.elemento,
                            nombre: e.target.value,
                          },
                        });
                      }}
                      required
                      pattern="^.{2,}$"
                      disabled={disabled}
                    />
                    <span className={styles["error-message"]}>
                      Minimo 2 caracteres
                    </span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    {categories.length > 0 && !disabled && (
                      <Select
                        options={categories.map((category) => ({
                          value: category.id,
                          label: category.nombre,
                          onClick: (value, label) => {
                            setSelectedCategory({
                              value,
                              label,
                            });
                          },
                        }))}
                        selected={selectedCategory}
                        onChange={() => {
                          setNewTicketData({
                            ...newTicketData,
                            elemento: {
                              ...newTicketData.elemento,
                              categoría_id: selectedCategory.value! as number,
                            },
                          });
                        }}
                      />
                    )}
                    {categories.length === 0 && (
                      <input
                        type="text"
                        placeholder="Seleccionar tu tipo de elemento"
                        required
                        disabled
                      />
                    )}
                  </div>
                  <div>
                    <textarea
                      placeholder="Descripción de tu elemento"
                      value={newTicketData.elemento.descripción}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          elemento: {
                            ...newTicketData.elemento,
                            descripción: e.target.value,
                          },
                        });
                      }}
                      minLength={10}
                      rows={4}
                      disabled={disabled}
                    />
                    <span className={styles["error-message"]}>
                      Minimo 10 caracteres
                    </span>
                  </div>
                </div>
                <div className={styles["problema-half"]}>
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre de tu problema*"
                      value={newTicketData.problema.nombre}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          problema: {
                            ...newTicketData.problema,
                            nombre: e.target.value,
                          },
                        });
                      }}
                      pattern="^.{2,}$"
                      required
                    />
                    <span className={styles["error-message"]}>
                      Minimo 2 caracteres
                    </span>
                  </div>
                  <div>
                    <textarea
                      placeholder="Descripción de tu problema"
                      value={newTicketData.problema.descripción}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          problema: {
                            ...newTicketData.problema,
                            descripción: e.target.value,
                          },
                        });
                      }}
                      minLength={10}
                      rows={4}
                    />
                    <span className={styles["error-message"]}>
                      Minimo 10 caracteres
                    </span>
                  </div>
                </div>
              </form>
              <div className={styles["button-container"]}>
                <button
                  className={styles["search-btn"]}
                  onClick={() => {
                    TicketService.createWithSession(
                      newTicketData.ticket,
                      newTicketData.elemento,
                      newTicketData.problema
                    ).then((res) => {
                      if (res === 201) {
                        toast.success("¡Tu ticket ha sido creado!", {
                          style: {
                            fontFamily: "Open Sans",
                          },
                        });
                        toast(
                          "Nos pondremos en contacto contigo en la brevedad de lo posible.",
                          {
                            style: {
                              fontFamily: "Open Sans",
                            },
                          }
                        );
                      } else {
                        toast.error("Ha ocurrido un error inesperado.", {
                          style: {
                            fontFamily: "Open Sans",
                          },
                        });
                      }
                    });
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
      {!isAbove495 && <FooterNavbar />}
      {isBelow1075 && (
        <Modal
          isOpen={isOpen}
          closeModal={() => {
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Nuevo;
