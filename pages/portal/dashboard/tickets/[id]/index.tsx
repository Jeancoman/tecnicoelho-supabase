import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import styles from "/styles/Portal.module.css";
import TicketService from "../../../../../utilities/ticketService";
import Head from "next/head";
import TicketElement from "../../../../../components/TicketElement";
import { Cliente, JwtPayload, ModalProps, Ticket } from "../../../../../types";
import TicketDisplay from "../../../../../components/TicketDisplay";
import Link from "next/link";
import session from "../../../../../utilities/sessionService";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { useMediaQuery } from "react-responsive";
import FooterNavbar from "../../../../../components/FooterNavbar";

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

const TicketPage: NextPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Cliente>();
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
          <TicketDisplay />
        </main>
      </div>
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

export default TicketPage;
