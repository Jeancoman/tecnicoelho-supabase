import type { NextPage } from "next";
import Head from "next/head";
import styles from "/styles/AboutUs.module.css";

const About: NextPage = () => {
  return (
    <main className={styles.main}>
      <Head>
        <title>Nosotros</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2>Nosotros</h2>
          <p>
            La historia de TecniCoelho empieza en el año 2014 como un
            emprendimiento personal para ofrecer soluciones informáticas, desde
            reparaciones y soporte técnico. Luego, el proyecto fue pausado y
            retomado nuevamente en el año 2016 ahora ofreciendo sus servicios a
            domicilio y con la integración de un nuevo miembro al equipo.
            Posteriormente, TecniCoelho fue transformado en una tienda física,
            ubicándose inicialmente en Galerías Giuseppe, donde, tras un año
            completo (2018 - 2019), fue trasladado a su ubicación actual en la
            calle Retumbo, entre la calle Descanso y Guasco en diciembre del año
            2019, contado así con un espacio más cómodo y personal en el cual
            enfocarse a las reparaciones de equipos electrónicos. En el año
            2020, viéndose fuertemente afectado por la pandemia del COVID-19,
            TecniCoelho se ve obligado a diversificarse, expandiendo sus
            fronteras en busca de nuevos conocimientos y experiencias en
            diversas áreas con las cuales ampliar sus servicios. Actualmente,
            TecniCoelho brinda servicios de reparación y soporte técnico a
            empresas y particulares, instalación, mantenimiento y configuración
            de redes informáticas, servicios de Community Manager y,
            próximamente, servicios de diseño gráfico.
          </p>
        </div>
        <div className={styles.center}>
          <div className={styles.mision}>
            <h2>Misión</h2>
            <p>
              Prestar servicios de reparación, instalación, mantenimiento y
              venta de equipo y software en el area de Informática
            </p>
          </div>
          <div className={styles.vision}>
            <h2>Visión</h2>
            <p>
              Ser un punto de referencia de calidad en servicios y ventas de
              equipos o software en área de Informática a nivel nacional
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <picture>
            <source srcSet="/mapa.jpg" type="image/jpg" />
            <img
              src="/mapa.jpg"
              alt="Profile placeholder"
              referrerPolicy="no-referrer"
            />
          </picture>
        </div>
      </div>
    </main>
  );
};

export default About;
