import { NextPage } from "next";
import styles from "/styles/Inicio.module.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import TicketService from "../../utilities/ticketService";
import session from "../../utilities/sessionService";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const Inicio: NextPage = () => {
  const router = useRouter();
  const [option, setOption] = useState<"BUSCAR" | "LOGIN">("BUSCAR");
  const [login, setLogin] = useState({
    documento: "",
    contraseña: "",
  });
  const [search, setSearch] = useState({
    ticket_id: "",
    contraseña: "",
  });


  useEffect(() => {
    if (session.find()) {
      router.push("/portal/dashboard");
    }
  });

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
