import { useRouter } from "next/router";
import styles from "../styles/TicketDisplay.module.css";
import { Ticket } from "../types";
import { useEffect, useState } from "react";
import TicketService from "../utilities/ticketService";
import Link from "next/link";

const TicketDisplay = () => {
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket>();
    const [mE, setME] = useState(0);
    const [mNE, setMNE] = useState(0);

    useEffect(() => {
        if (router.isReady) {
            TicketService.get(router.query.id as string).then((data) => {
                setTicket(data || undefined);
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
                <div className={styles.title}>ID-{ticket?.id || 0}</div>
                {ticket?.estado === "ABIERTO" ? (
                    <div className={styles.status}>Abierto</div>
                ) : ticket?.estado === "CERRADO" ? (
                    <div className={styles["status-red"]}>Cerrado</div>
                ) : (
                    <div className={styles["status-gray"]}>Esperando...</div>
                )}
            </div>
            <div className={styles["second-row"]}>
                <div
                    className={styles.title}
                    style={{
                        marginBottom: "10px",
                    }}
                >
                    Resumen
                </div>
                <div className={styles.information}>
                    <p>
                        <strong>Asunto:</strong> {ticket?.asunto || "N/A"}
                    </p>
                    <p>
                        <strong>Prioridad:</strong> {ticket?.prioridad || "N/A"}
                    </p>
                    <p>
                        <strong>Tipo:</strong> {ticket?.tipo || "N/A"}
                    </p>
                    <p>
                        <strong>Categoría:</strong>{" "}
                        {ticket?.categoría?.nombre || "N/A"}
                    </p>
                    <p>
                        <strong>Fecha de creación:</strong>{" "}
                        {ticket?.creado
                            ? new Date(ticket.creado).toLocaleDateString()
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Fecha de cierre:</strong>{" "}
                        {ticket?.cerrado
                            ? new Date(ticket?.cerrado!).toLocaleDateString()
                            : "Nunca"}
                    </p>
                    <div className={styles["message-section"]}>
                        <h3>Mensajes</h3>
                        <div className={styles.row}>
                            <Link
                                href={
                                    "/portal/dashboard/tickets/" +
                                    (router.query.id || "0") +
                                    "/mensajes?mostrar=enviados"
                                }
                            >
                                <div className={styles["green-box"]}>
                                    <p>Enviados</p>
                                    <p> {mE >= 10 ? mE : "0" + mE}</p>
                                </div>
                            </Link>
                            <Link
                                href={
                                    "/portal/dashboard/tickets/" +
                                    (router.query.id || "0") +
                                    "/mensajes?mostrar=no-enviados"
                                }
                            >
                                <div className={styles["gray-box"]}>
                                    <p>No enviados</p>
                                    <p> {mNE >= 10 ? mNE : "0" + mNE}</p>
                                </div>
                            </Link>
                            <Link
                                href={
                                    "/portal/dashboard/tickets/" +
                                    (router.query.id || "0") +
                                    "/mensajes?mostrar=todos"
                                }
                            >
                                <div className={styles["normal-box"]}>
                                    <p>Totales</p>
                                    <p>
                                        {mNE + mE >= 10
                                            ? mNE + mE
                                            : "0" + (mNE + mE)}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["description-section"]}>
                <h3>Descripción</h3>
                {ticket?.descripción ? (
                    <div
                        className={styles["description-content"]}
                        dangerouslySetInnerHTML={{
                            __html: ticket.descripción,
                        }}
                    />
                ) : (
                    <p>No hay descripción disponible.</p>
                )}
            </div>
        </div>
    );
};

export default TicketDisplay;
