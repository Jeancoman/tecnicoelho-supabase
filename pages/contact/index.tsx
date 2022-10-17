import type { NextPage } from "next";
import styles from "/styles/Contact.module.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Contact: NextPage = () => {
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
          fontFamily: "Open Sans",
        },
      });
      return;
    }

    toast.success("Mensaje enviado exitosamente!", {
      style: {
        fontFamily: "Open Sans",
      },
    });
  };

  return (
    <main>
      <section className={styles.contact}>
        <div className={styles["h2-container"]}>
          <h2>Contáctanos</h2>
          <hr />
        </div>
        <p>
          Por favor rellene el siguiente formulario con toda la información
          posible sobre su consulta, o llámenos al <span>+58 0426-2452374</span>
          .
        </p>
        <div className={styles.container}>
          <div className={styles.left}>
            <h3>Ubicanos en</h3>
            <div className={styles.text}>
              <p>Galegia Giusseppe</p>
              <p>Calle Retumbo</p>
              <p>Valle de la Pascua</p>
              <p>2350</p>
              <p>Guárico, Venezuela</p>
              <p>
                <strong>Tel: +58 0426-2452374</strong>
              </p>
              <p>
                correo: <span>tecnicoelho1@gmail.com</span>
              </p>
            </div>
            <div className={styles.icons}>
              <a
                href="https://www.instagram.com/tecnicoelho"
                target="_blank"
                rel="noreferrer"
              >
                <picture className={styles.icon}>
                  <source srcSet="/instagram.svg" type="image/svg" />
                  <img src="/instagram.svg" alt="Instagram" />
                </picture>
              </a>
              <a
                href="https://twitter.com/tecnicoelho"
                target="_blank"
                rel="noreferrer"
              >
                <picture className={styles.icon}>
                  <source srcSet="/twitter.svg" type="image/svg" />
                  <img src="/twitter.svg" alt="Twitter" />
                </picture>
              </a>
              <a
                href="https://www.facebook.com/tecnicoelho"
                target="_blank"
                rel="noreferrer"
              >
                <picture className={styles.icon}>
                  <source srcSet="/facebook.svg" type="image/svg" />
                  <img src="/facebook.svg" alt="Facebook" />
                </picture>
              </a>
            </div>
          </div>
          <div className={styles.right}>
            <h3>Formulario de contacto</h3>
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
                onChange={(e) => setAsunto(e.target.value)}
              />
              <textarea
                name=""
                id=""
                placeholder="Mensaje*"
                required
                onChange={(e) => setMensaje(e.target.value)}
              ></textarea>
              <button type="submit">Contáctanos</button>
            </form>
          </div>
        </div>
      </section>
      <Toaster />
    </main>
  );
};

export default Contact;
