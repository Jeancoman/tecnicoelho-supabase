import { ChangeEvent, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../styles/WhatsAppModal.module.css";

type Modal = {
  setShowModal: (value: SetStateAction<boolean>) => void;
  showModal: boolean;
};

const WhatsAppModal = ({ showModal, setShowModal }: Modal) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = encodeURI(message);
    window.open(
      "https://web.whatsapp.com/send?phone=584262452374&text=" +
        text +
        "&app_absent=0"
    );
    const dialog = ref.current;
    dialog?.close();
    setMessage("");
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    const dialog = ref.current;

    dialog?.removeAttribute("open");

    if (showModal) {
      dialog?.showModal();
    }

    return () => dialog?.close();
  }, [showModal]);

  return (
    <dialog ref={ref} className={styles.modal}>
      <div className={styles.title}>
        <h3>¡Escribe tu mensaje!</h3>
        <picture
          onClick={() => setShowModal(!showModal)}
          className={styles.close}
        >
          <source srcSet="/close.svg" type="image/svg" />
          <img src="/close.svg" alt="Close" />
        </picture>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          onChange={handleChange}
          placeholder="Mensaje*"
          maxLength={200}
          required
        />
        <div className={styles.counter}>{message.length}/200</div>
        <button>Abrir chat en pestaña nueva</button>
      </form>
    </dialog>
  );
};

export default WhatsAppModal;
