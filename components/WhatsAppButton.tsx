import { SetStateAction } from "react";
import UAParser from "ua-parser-js";
import styles from "../styles/WhatsAppButton.module.css";

type ModalOpener = {
    setShowModal:  (value: SetStateAction<boolean>) => void,
    showModal: boolean
}
const WhatsAppButton = ({showModal, setShowModal}: ModalOpener) => {
  const parser = new UAParser();
  const device = parser.getDevice();

  return (
    <>
      {device.type == "mobile" ? (
        <a
          className={styles["whatsapp_float"]}
          href="https://wa.me/4262452374"
          target="_blank"
          rel="noopener noreferrer"
        >
          <picture className={styles["whatsapp-icon"]}>
            <source srcSet="/whatsapp.svg" type="image/svg" />
            <img src="/whatsapp.svg" alt="Whats App" />
          </picture>
        </a>
      ) : (
        <div className={styles["whatsapp_float"]} onClick={() => setShowModal(!showModal)}>
          <picture className={styles["whatsapp-icon"]}>
            <source srcSet="/whatsapp.svg" type="image/svg" />
            <img src="/whatsapp.svg" alt="Whats App" />
          </picture>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
