import Link from "next/link";
import styles from "../styles/TicketModalElement.module.css";
import { Ticket } from "../types";

const TicketElement = (ticket: Ticket) => {
  return (
    <Link href={"/portal/dashboard/tickets/" + ticket.id}>
      <div className={styles.container}>
        <div className={styles.id}>TID-{ticket.id}</div>
        {ticket.estado === "ABIERTO" ? (
          <div className={styles.status}>Abierto</div>
        ) : ticket.estado === "CERRADO" ? (
          <div className={styles["status-red"]}>Cerrado</div>
        ) : (
          <div className={styles["status-gray"]}>Esperando...</div>
        )}
        <div className={styles.date}>{ticket.creado?.slice(0, 10)}</div>
      </div>
    </Link>
  );
};

export default TicketElement;