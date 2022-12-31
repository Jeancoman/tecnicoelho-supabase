import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/Modal.module.css";
import toast from "react-hot-toast";

type Show = {
  show: boolean;
  handleClose: () => void;
  producto: string;
};

const Modal = ({ show, handleClose, producto }: Show) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("Me interesa un producto.");
  const [mensaje, setMensaje] = useState(
    "Hola, me interesa el producto " + producto + "."
  );
  const [telefono, setTelefono] = useState("");
  const ref = useRef<HTMLDialogElement>(null);

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      handleClose();
    }
  }, []);

  const outsideClick = (event: MouseEvent) => {
    const dialog = ref.current;
    const e = event.target as HTMLElement;

    if (e.innerHTML === dialog?.innerHTML) {
      handleClose();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/send", {
      body: JSON.stringify({
        email: email,
        nombre: nombre + " " + apellido,
        asunto: asunto,
        mensaje: mensaje,
        telefono: telefono,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();

    if (error) {
      toast.error("No se pudo enviar el mensaje", {
        style: {
          fontFamily: "Open Sans",
        },
      });

      return ref.current?.close();
    }

    toast.success("Mensaje enviado exitosamente!", {
      style: {
        fontFamily: "Open Sans",
      },
    });

    ref.current?.close();
  };

  useEffect(() => {
    const dialog = ref.current;

    dialog?.removeAttribute("open");

    if (show) {
      dialog?.showModal();
    }

    return () => dialog?.close();
  }, [show]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", outsideClick, true);

    return () => {
      document.removeEventListener("click", outsideClick, true);
    };
  }, []);

  return (
    <>
      <dialog id="dialog" className={styles.modal} ref={ref}>
        <div className={styles["modal-header"]}>
          <h3>Formulario de contacto</h3>
          <picture onClick={handleClose} className={styles.close}>
            <source srcSet="/close.svg" type="image/svg" />
            <img src="/close.svg" alt="Close" />
          </picture>
        </div>
        <form onSubmit={handleSubmit} method="POST">
          <input
            type="text"
            name="firstName"
            id=""
            placeholder="Nombre*"
            required
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            name="lastName"
            id=""
            placeholder="Apellido*"
            required
            onChange={(e) => setApellido(e.target.value)}
          />
          <input
            type="email"
            name="email"
            id=""
            placeholder="Correo electrónico*"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            name="telefono"
            id=""
            placeholder="Número telefonico"
            onChange={(e) => setTelefono(e.target.value)}
            minLength={10}
            maxLength={11}
            pattern="[0-9]*"
          />
          <input
            type="text"
            name="asunto"
            id=""
            placeholder="Asunto*"
            required
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
          />
          <textarea
            name=""
            id=""
            placeholder="Mensaje*"
            required
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          ></textarea>
          <button type="submit">Contáctanos</button>
        </form>
      </dialog>
    </>
  );
};

export default Modal;
