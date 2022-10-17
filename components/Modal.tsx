import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/Modal.module.css";
import toast, { Toaster } from "react-hot-toast";

type Show = {
  show: boolean;
  handleClose: () => void;
  producto: string;
};

const Modal = ({ show, handleClose, producto }: Show) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e: any) => {
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
      console.log(error);
      toast.error("No se pudo enviar el mensaje", {
        style: {
            fontFamily: "Open Sans"
        }
    });
    handleClose()
      return;
    }

    toast.success("Mensaje enviado exitosamente!", {
        style: {
            fontFamily: "Open Sans"
        }
    });
    handleClose()
  };
  return (
    <>
      {show ? (
        <dialog id="dialog" className={styles.modal} open>
          <div className={styles["modal-header"]}>
            <h3>Formulario de contacto</h3>
            <span onClick={handleClose}>X</span>
          </div>
          <form onSubmit={handleSubmit}>
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
            />
            <input
              type="text"
              name="asunto"
              id=""
              placeholder="Asunto*"
              required
              defaultValue={"Me interesa un producto."}
              onChange={(e) => setAsunto(e.target.value)}
            />
            <textarea
              name=""
              id=""
              placeholder="Mensaje*"
              required
              defaultValue={"Hola, me interesa el producto " + producto}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
            <button type="submit">Contáctanos</button>
          </form>
        </dialog>
      ) : null}
    </>
  );
};

export default Modal;
