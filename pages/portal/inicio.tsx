import { NextPage } from "next";
import styles from "/styles/Inicio.module.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Categoría,
  Cliente,
  Elemento,
  Problema,
  Selected,
  Ticket,
} from "../../types";
import TicketService from "../../utilities/ticketService";
import session from "../../utilities/sessionService";
import { useRouter } from "next/router";
import CategoryService from "../../utilities/categoryService";
import Select from "../../components/Search";
import toast, { Toaster } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

const Inicio: NextPage = () => {
  const router = useRouter();
  const [option, setOption] = useState<"BUSCAR" | "ABRIR" | "LOGIN">("BUSCAR");
  const [newTicketData, setNewTicketData] = useState<{
    ticket: Ticket;
    cliente: Cliente;
    elemento: Elemento;
    problema: Problema;
  }>({
    cliente: {
      nombre: "",
      apellido: "",
      enviarMensajes: false,
      documento: "",
      telefono: "",
      email: "",
    },
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
  const [login, setLogin] = useState({
    documento: "",
    contraseña: "",
  });
  const [search, setSearch] = useState({
    ticket_id: "",
    contraseña: "",
  });
  const [categories, setCategories] = useState<Categoría[]>([]);
  const [documentType, setDocumentType] = useState<Selected>({
    value: "RIF",
    label: "RIF",
  });
  const [selectedCategory, setSelectedCategory] = useState<Selected>({
    value: -1,
    label: "Seleccionar tipo de elemento*",
  });
  const max450px = useMediaQuery({ query: "(max-width: 450px)" });

  useEffect(() => {
    CategoryService.getAllDigitales().then((data) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    if (session.find()) {
      router.push("/portal/dashboard");
    }
  });

  useEffect(() => {
    if(window.location.hash === "#nuevo"){
      setOption("ABRIR");
    }
  }, [])


  return (
    <>
      <Head>
        <title>Portal</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        {option === "BUSCAR" && (
          <div className={styles["form-container"]}>
            <div>
              <h2>¡Encuentra tu ticket ahora!</h2>
              <form>
                <div>
                  <input
                    type="text"
                    placeholder="ID de tu ticket"
                    value={search.ticket_id}
                    onChange={(e) => {
                      setSearch({
                        ...search,
                        ticket_id: e.target.value,
                      });
                    }}
                    required
                    minLength={1}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Tu contraseña"
                    value={search.contraseña}
                    onChange={(e) => {
                      setSearch({
                        ...search,
                        contraseña: e.target.value,
                      });
                    }}
                    required
                    minLength={1}
                  />
                </div>
              </form>
              <button
                className={styles["search-btn"]}
                onClick={() => {
                  TicketService.searchLogin(
                    search.ticket_id,
                    search.contraseña
                  ).then((data) => {
                    if (data) {
                      toast.success("¡Ticket encontrado!", {
                        style: {
                          fontFamily: "Open Sans",
                        },
                      });
                      session.set(data);
                      router.push(
                        "/portal/dashboard/tickets/" + search.ticket_id
                      );
                    } else {
                      toast.error("Ticket no encontrado.", {
                        style: {
                          fontFamily: "Open Sans",
                        },
                      });
                    }
                  });
                }}
              >
                Buscar
              </button>
              <div className={styles.or}>
                <hr />
                <div>O</div>
                <hr />
              </div>
              <div className={styles["or-two"]}>
                <div
                  onClick={() => {
                    setOption("ABRIR");
                  }}
                >
                  Abrir un ticket
                </div>
                <div></div>
                <div
                  onClick={() => {
                    setOption("LOGIN");
                  }}
                >
                  Iniciar sesión
                </div>
              </div>
            </div>
          </div>
        )}
        {option === "LOGIN" && (
          <div className={styles["form-container"]}>
            <div>
              <h2>¡Inicia sesión en tu cuenta!</h2>
              <form>
                <div className={styles.document}>
                  <input
                    type="text"
                    placeholder={"Tu cédula o RIF*"}
                    value={login.documento}
                    onChange={(e) => {
                      setLogin({
                        ...login,
                        documento: e.target.value,
                      });
                    }}
                    required
                    minLength={1}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Tu contraseña"
                    value={login.contraseña}
                    onChange={(e) => {
                      setLogin({
                        ...login,
                        contraseña: e.target.value,
                      });
                    }}
                    required
                    minLength={1}
                  />
                </div>
              </form>
              <button
                className={styles["search-btn"]}
                onClick={() => {
                  TicketService.login(login.documento, login.contraseña).then(
                    (data) => {
                      if (data) {
                        toast.success("¡Credenciales validas!", {
                          style: {
                            fontFamily: "Open Sans",
                          },
                        });
                        session.set(data);
                        router.push("/portal/dashboard");
                      } else {
                        toast.error("Credenciales invalidas.", {
                          style: {
                            fontFamily: "Open Sans",
                          },
                        });
                      }
                    }
                  );
                }}
              >
                Continuar
              </button>
              <div className={styles.or}>
                <hr />
                <div>O</div>
                <hr />
              </div>
              <div className={styles["or-two"]}>
                <div
                  onClick={() => {
                    setOption("ABRIR");
                  }}
                >
                  Abrir un ticket
                </div>
                <div></div>
                <div
                  onClick={() => {
                    setOption("BUSCAR");
                  }}
                >
                  Buscar un ticket
                </div>
              </div>
            </div>
          </div>
        )}
        {option === "ABRIR" && (
          <div className={styles["form-container"]}>
            <div>
              <h2>¡Abre un ticket!</h2>
              <form>
                <div className={styles["form-div"]}>
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre*"
                      value={newTicketData.cliente?.nombre}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          cliente: {
                            ...newTicketData.cliente,
                            nombre: e.target.value,
                          },
                        });
                      }}
                      className={styles.a}
                      pattern="^.{2,}$"
                      required
                    />
                    <span className={styles["error-message"]}>
                      Minimo 2 caracteres
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      value={newTicketData.cliente?.apellido}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          cliente: {
                            ...newTicketData.cliente,
                            apellido: e.target.value,
                          },
                        });
                      }}
                      className={styles.b}
                    />
                    <span className={styles["error-message"]}>
                      Minimo 2 caracteres
                    </span>
                  </div>
                </div>
                <div className={styles["form-div"]}>
                  <div className={styles.document}>
                    <div
                      style={{
                        position: "relative",
                        width: "28%",
                        height: max450px ? undefined : "46px",
                      }}
                    >
                      <Select
                        options={[
                          {
                            value: "V",
                            label: "V",
                            onClick: (value, label) => {
                              setDocumentType({
                                value,
                                label,
                              });
                            },
                          },
                          {
                            value: "RIF",
                            label: "RIF",
                            onClick: (value, label) => {
                              setDocumentType({
                                value,
                                label,
                              });
                            },
                          },
                        ]}
                        selected={documentType}
                        small={true}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder={
                          documentType.value === "V" ? "Tu cédula*" : "Tu RIF*"
                        }
                        value={newTicketData.cliente?.documento}
                        onChange={(e) => {
                          setNewTicketData({
                            ...newTicketData,
                            cliente: {
                              ...newTicketData.cliente,
                              documento: e.target.value,
                            },
                          });
                        }}
                        pattern={
                          documentType.value === "RIF"
                            ? "^[A-Za-z]-?\\d{1,9}-?\\d?$"
                            : "^\\d{1,3}\\.\\d{3}\\.\\d{3}$"
                        }
                        style={{
                          height: max450px ? "40px" : "46px",
                          marginLeft: "5px",
                        }}
                        required
                      />
                      <span className={styles["error-message"]}>
                        {documentType.value === "RIF"
                          ? "Formato: J-30684267-5"
                          : "Formato: 29.946.012"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tu teléfono*"
                      value={newTicketData.cliente?.telefono}
                      onChange={(e) => {
                        setNewTicketData({
                          ...newTicketData,
                          cliente: {
                            ...newTicketData.cliente,
                            telefono: e.target.value,
                          },
                        });
                      }}
                      pattern="^\+(?:[0-9]●?){6,14}[0-9]$"
                      required={true}
                    />
                    <span className={styles["error-message"]}>
                      +580XXXXXXXXXX
                    </span>
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Tu email*"
                    value={newTicketData.cliente?.email}
                    onChange={(e) => {
                      setNewTicketData({
                        ...newTicketData,
                        cliente: {
                          ...newTicketData.cliente,
                          email: e.target.value,
                        },
                      });
                    }}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    required={true}
                  />
                  <span className={styles["error-message"]}>
                    E-mail invalido
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Tu contraseña*"
                    value={newTicketData.cliente?.contraseña}
                    onChange={(e) => {
                      setNewTicketData({
                        ...newTicketData,
                        cliente: {
                          ...newTicketData.cliente,
                          contraseña: e.target.value,
                        },
                      });
                    }}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$¡!%*¿?&#^_+\-=<>\\./,\[\]{}\(\):;|~])[A-Za-z\d@$¡!%*¿?&#^_+\-=<>\\./,\[\]{}\(\):;|~]{8,}$"
                  />
                  <span className={styles["error-message"]}>
                    La contraseña debe tener minimo 8 caracteres, contener una
                    letra mayuscula, una letra minúscula, un número y un
                    carácter especial
                  </span>
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
                  {categories.length > 0 && (
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
                  />
                  <span className={styles["error-message"]}>
                    Minimo 10 caracteres
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nombre del problema*"
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
                    placeholder="Descripción del problema"
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
                  />
                  <span className={styles["error-message"]}>
                    Minimo 10 caracteres
                  </span>
                </div>
              </form>
              <button
                className={styles["search-btn"]}
                onClick={() => {
                  TicketService.create(
                    newTicketData.ticket,
                    newTicketData.cliente,
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
                    } else if (res === 401) {
                      toast.error(
                        documentType.value === "V"
                          ? `La cédula ${newTicketData.cliente.documento} ya esta registrada.`
                          : `El RIF ${newTicketData.cliente.documento} ya esta registrado.`,
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
              <div className={styles["form-note"]}>
                Nota: Si ya tienes una cuenta, te recomendamos que abras un
                ticket desde el portal de usuario{" "}
              </div>
              <div className={styles.or}>
                <hr />
                <div>O</div>
                <hr />
              </div>
              <div className={styles["or-two"]}>
                <div
                  onClick={() => {
                    setOption("LOGIN");
                  }}
                >
                  Iniciar sesión
                </div>
                <div></div>
                <div
                  onClick={() => {
                    setOption("BUSCAR");
                  }}
                >
                  Buscar un ticket
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default Inicio;
