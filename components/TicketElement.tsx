import styles from "../styles/TicketElement.module.css";

const TicketElement = () => {
    return (
        <div className={styles.container}>
            <div className={styles.id}>TID-1</div>
            <div className={styles.status}>Abierto</div>
            <div className={styles.date}>04/02/2024</div>
        </div>
    )
}

export default TicketElement;