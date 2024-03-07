import styles from "../styles/TicketDisplay.module.css";

const TicketDisplay = () => {
  return (
    <div className={styles.container}>
      <div className={styles["first-row"]}>
        <div className={styles.title}>TID-1</div>
        <div className={styles.status}>Abierto</div>
      </div>
      <div className={styles["note-container"]}>
        <div className={styles["note"]}>
          <div className={styles["note-title-container"]}>
            <p className={styles["note-title"]}>Notas de apertura</p>
            <div className={styles.date}>04/02/2024</div>
          </div>
          <p className={styles["note-body"]}>Nada que mostrar...</p>
        </div>
        <div className={styles["note"]}>
          <div className={styles["note-title-container"]}>
            <p className={styles["note-title"]}>Notas de cierre</p>
            <div className={styles.date}>04/02/2024</div>
          </div>
          <p className={styles["note-body"]}>Nada que mostrar...</p>
        </div>
      </div>
      <div className={styles["second-row"]}>
        <div className={styles.title}>Resumen</div>
      </div>
      <div className={styles.information}>
        <div>
          <p className={styles["note-title"]}>Problemas</p>
          <div className={styles.row}>
            <div className={styles["green-box"]}>
              <p>Resueltos</p>
              <p>01</p>
            </div>
            <div className={styles["gray-box"]}>
              <p>Pendientes</p>
              <p>01</p>
            </div>
            <div className={styles["normal-box"]}>
              <p>Totales</p>
              <p>01</p>
            </div>
          </div>
        </div>
        <div>
          <p className={styles["note-title"]}>Servicios</p>
          <div className={styles.row}>
            <div className={styles["green-box"]}>
              <p>Completados</p>
              <p>01</p>
            </div>
            <div className={styles["purple-box"]}>
              <p>Iniciados</p>
              <p>01</p>
            </div>
            <div className={styles["gray-box"]}>
              <p>Pendientes</p>
              <p>01</p>
            </div>
            <div className={styles["normal-box"]}>
              <p>Totales</p>
              <p>01</p>
            </div>
          </div>
        </div>
        <div>
          <p className={styles["note-title"]}>Mensajes</p>
          <div className={styles.row}>
            <div className={styles["green-box"]}>
              <p>Enviados</p>
              <p>01</p>
            </div>
            <div className={styles["gray-box"]}>
              <p>No enviados</p>
              <p>01</p>
            </div>
            <div className={styles["normal-box"]}>
              <p>Totales</p>
              <p>01</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDisplay;
