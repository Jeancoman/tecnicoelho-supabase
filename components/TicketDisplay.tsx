import { useRouter } from "next/router";
import styles from "../styles/TicketDisplay.module.css";
import { Ticket } from "../types";
import { useEffect, useState } from "react";
import TicketService from "../utilities/ticketService";
import Link from "next/link";

const TicketDisplay = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket>();
  const [pR, setPR] = useState(0);
  const [pP, setPP] = useState(0);
  const [sP, setSP] = useState(0);
  const [sI, setSI] = useState(0);
  const [sC, setSC] = useState(0);
  const [mE, setME] = useState(0);
  const [mNE, setMNE] = useState(0);

  useEffect(() => {
    if (router.isReady) {
      TicketService.get(router.query.id as string).then((data) => {
        setTicket(data || undefined);
      });

      TicketService.getAllProblemsCountByState(
        "RESUELTO",
        router.query.id as string
      ).then((data) => {
        setPR(data);
      });

      TicketService.getAllProblemsCountByState(
        "PENDIENTE",
        router.query.id as string
      ).then((data) => {
        setPP(data);
      });

      TicketService.getAllServicesCountByState(
        "PENDIENTE",
        router.query.id as string
      ).then((data) => {
        setSP(data);
      });

      TicketService.getAllServicesCountByState(
        "INICIADO",
        router.query.id as string
      ).then((data) => {
        setSI(data);
      });

      TicketService.getAllServicesCountByState(
        "COMPLETADO",
        router.query.id as string
      ).then((data) => {
        setSC(data);
      });

      TicketService.getAllMensajesCountByState(
        "ENVIADO",
        router.query.id as string
      ).then((data) => {
        setME(data);
      });

      TicketService.getAllMensajesCountByState(
        "NO_ENVIADO",
        router.query.id as string
      ).then((data) => {
        setMNE(data);
      });
    }
  }, [router.isReady, router.query.id]);

  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.title}>TID-{ticket?.id || 0}</div>
        {ticket?.estado === "ABIERTO" ? (
          <div className={styles.status}>Abierto</div>
        ) : ticket?.estado === "CERRADO" ? (
          <div className={styles["status-red"]}>Cerrado</div>
        ) : (
          <div className={styles["status-gray"]}>Esperando...</div>
        )}
      </div>
      <div className={styles["note-container"]}>
        <div className={styles["note"]}>
          <div className={styles["note-title-container"]}>
            <p className={styles["note-title"]}>Notas de apertura</p>
            <div className={styles.date}>{ticket?.creado?.slice(0, 10)}</div>
          </div>
          {ticket?.notas_de_apertura === "" ? (
            <p className={styles["note-body"]}>Nada que mostrar...</p>
          ) : (
            <p className={styles["note-body-total"]}>
              {ticket?.notas_de_apertura}
            </p>
          )}
        </div>
        <div className={styles["note"]}>
          <div className={styles["note-title-container"]}>
            <p className={styles["note-title"]}>Notas de cierre</p>
            <div className={styles.date}>
              {ticket?.creado?.slice(0, 10) || "N/A"}
            </div>
          </div>
          {ticket?.notas_de_cierre === "" ? (
            <p className={styles["note-body"]}>Nada que mostrar...</p>
          ) : (
            <p className={styles["note-body-total"]}>
              {ticket?.notas_de_cierre}
            </p>
          )}
        </div>
      </div>
      <div className={styles["second-row"]}>
        <div className={styles.title}>Resumen</div>
      </div>
      <div className={styles.information}>
        <div>
          <p className={styles["note-title"]}>Problemas</p>
          <div className={styles.row}>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/problemas?mostrar=resueltos"
              }
            >
              <div className={styles["green-box"]}>
                <p>Resueltos</p>
                <p>{pR >= 10 ? pR : "0" + pR}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/problemas?mostrar=pendientes"
              }
            >
              <div className={styles["gray-box"]}>
                <p>Pendientes</p>
                <p> {pP >= 10 ? pP : "0" + pP}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0")+ "/problemas?mostrar=todos"
              }
            >
              <div className={styles["normal-box"]}>
                <p>Totales</p>
                <p>{pP + pR >= 10 ? pP + pR : "0" + (pP + pR)}</p>
              </div>
            </Link>
          </div>
        </div>
        <div>
          <p className={styles["note-title"]}>Servicios</p>
          <div className={styles.row}>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/servicios?mostrar=completados"
              }
            >
              <div className={styles["green-box"]}>
                <p>Completados</p>
                <p> {sC >= 10 ? sC : "0" + sC}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/servicios?mostrar=iniciados"
              }
            >
              <div className={styles["purple-box"]}>
                <p>Iniciados</p>
                <p> {sI >= 10 ? sI : "0" + sI}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/servicios?mostrar=pendientes"
              }
            >
              <div className={styles["gray-box"]}>
                <p>Pendientes</p>
                <p> {sP >= 10 ? sP : "0" + sP}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/servicios?mostrar=todos"
              }
            >
              <div className={styles["normal-box"]}>
                <p>Totales</p>
                <p>
                  {" "}
                  {sC + sI + sP >= 10 ? sC + sI + sP : "0" + (sC + sI + sP)}
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div>
          <p className={styles["note-title"]}>Mensajes</p>
          <div className={styles.row}>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0")+ "/mensajes?mostrar=enviados"
              }
            >
              <div className={styles["green-box"]}>
                <p>Enviados</p>
                <p> {mE >= 10 ? mE : "0" + mE}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/mensajes?mostrar=no-enviados"
              }
            >
              <div className={styles["gray-box"]}>
                <p>No enviados</p>
                <p> {mNE >= 10 ? mNE : "0" + mNE}</p>
              </div>
            </Link>
            <Link
              href={
                "/portal/dashboard/tickets/" + (router.query.id ||
                "0") + "/mensajes?mostrar=todos"
              }
            >
              <div className={styles["normal-box"]}>
                <p>Totales</p>
                <p> {mNE + mE >= 10 ? mNE + mE : "0" + (mNE + mE)}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDisplay;
