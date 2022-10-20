import useEmblaCarousel from "embla-carousel-react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback } from "react";
import BlogFeed from "../components/BlogFeedHome";
import Product from "../components/Product";
import styles from "../styles/Home.module.css";
import { supabase } from "../utilities/supabaseClient";

const Home: NextPage = ({ data, posts }: any) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 3,
    loop: true,
  });
  const [emblaRefTwo, emblaApiTwo] = useEmblaCarousel({ slidesToScroll: 5 });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrevTwo = useCallback(() => {
    if (emblaApiTwo) emblaApiTwo.scrollPrev();
  }, [emblaApiTwo]);

  const scrollNextTwo = useCallback(() => {
    if (emblaApiTwo) emblaApiTwo.scrollNext();
  }, [emblaApiTwo]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Inicio</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles["hero-container"]}>
        <div className={styles["hero-text"]}>
          <h1 className={styles["hero-maintext"]}>Soluciones informáticas</h1>
          <div className={styles["hero-subtext"]}>
            para empresas y particulares
          </div>
        </div>
        <div className={styles.photo}>
          <picture>
            <source srcSet="/keyboard.png" type="image/png" />
            <img
              src="/keyboard.png"
              alt="Profile placeholder"
              referrerPolicy="no-referrer"
            />
          </picture>
        </div>
      </div>
      <section className={styles.services}>
        <h1>Nuestros servicios</h1>
        <div className={styles.cen}>
          <div className={styles.service}>
            <picture>
              <source srcSet="/wrench-solid.svg" type="image/svg" />
              <img
                src="/wrench-solid.svg"
                alt="Perfil"
                referrerPolicy="no-referrer"
              />
            </picture>
            <h2>Soporte Tecnico</h2>
            <p>Proporcionamos reparación de equipos y soporte tecnico</p>
          </div>
          <div className={styles.service}>
            <picture>
              <source srcSet="/wifi-solid.svg" type="image/svg" />
              <img
                src="/wifi-solid.svg"
                alt="Perfil"
                referrerPolicy="no-referrer"
              />
            </picture>
            <h2>Redes Informaticas</h2>
            <p>
              Nos encargamos de la instalación, configuración y mantenimiento de
              redes informaticas
            </p>
          </div>
          <div className={styles.service}>
            <picture>
              <source srcSet="/briefcase-solid.svg" type="image/svg" />
              <img
                src="/briefcase-solid.svg"
                alt="Perfil"
                referrerPolicy="no-referrer"
              />
            </picture>
            <h2>Comunity Manager</h2>
            <p>
              Brindamos servicios de Comunity Manager para tus redes sociales
            </p>
          </div>

          <div className={styles.service}>
            <picture>
              <source srcSet="/computer-solid.svg" type="image/svg" />
              <img
                src="/computer-solid.svg"
                alt="Perfil"
                referrerPolicy="no-referrer"
              />
            </picture>
            <h2>Productos y componentes</h2>
            <p>
              Ofrecemos una amplia variedad de productos y componentes para tu
              computadora
            </p>
          </div>
          <div className={styles.service}>
            <picture>
              <source srcSet="/person.svg" type="image/svg" />
              <img
                src="/truck-solid.svg"
                alt="Perfil"
                referrerPolicy="no-referrer"
              />
            </picture>
            <h2>Encargo</h2>
            <p>
              Y si no encuentras lo que buscas, puedes encargarlo con nosotros
            </p>
          </div>
        </div>
      </section>
      <section className={styles.information}>
        <h2 className={styles["information-header"]}>
          Productos más recientes
        </h2>
        <div className={styles["line-break"]}></div>
        <div className={styles["information-container"]}>
          <div className={styles.embla}>
            <div className={styles["embla__viewport"]} ref={emblaRef}>
              <div className={styles["embla__container"]}>
                {data?.map((data: any) => {
                  return (
                    <div className={styles["embla__slide"]} key={data?.id}>
                      <Product
                        title={data?.nombre}
                        price={data?.precio}
                        image={data?.imagenes[0]}
                        id={data?.id}
                        key={data?.id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button className={styles.prev} onClick={scrollPrev}>
            {"<"}
          </button>
          <button className={styles.next} onClick={scrollNext}>
            {">"}
          </button>
        </div>
      </section>
      <section className={styles.information}>
        <h2 className={styles["information-header"]}>
          Publicaciones más recientes
        </h2>
        <div className={styles["line-break"]}></div>
        <div className={styles["information-container"]}>
          <div className={styles.embla}>
            <div className={styles["embla__viewport"]} ref={emblaRefTwo}>
              <div className={styles["embla__container"]}>
                {posts?.map((post: any) => {
                  return (
                    <div className={styles["embla__slide"]} key={post?.id}>
                      <BlogFeed
                        titulo={post?.titulo}
                        fecha={post?.creado_en}
                        imagen={post?.id_imagen}
                        id={post?.id}
                        key={post?.id}
                        contenido={post?.contenido}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button className={styles.prev} onClick={scrollPrevTwo}>
            {"<"}
          </button>
          <button className={styles.next} onClick={scrollNextTwo}>
            {">"}
          </button>
        </div>
      </section>
    </main>
  );
};

/* export async function getServerSideProps() {
  const db = getFirestore(firebaseApp);
  let q = query(
    collection(db, "productos"),
    orderBy("fecha_creacion"),
    limit(10)
  );
  let querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(postToJSON);

  q = query(
    collection(db, "publicaciones"),
    orderBy("fecha_creacion"),
    limit(10)
  );
  querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map(postToJSON);
  console.log(posts);

  return {
    props: {
      data,
      posts,
    },
  };
} */

export const getServerSideProps: GetServerSideProps = async () => {
  const producto = await supabase.from("producto").select().order("creado_en", { ascending: true }).limit(10);
  const publicaciones = await supabase
    .from("publicación")
    .select(
      `id, creado_en, titulo, contenido, actualizado_en, id_imagen(enlace)`
    )
    .limit(10);
  const imagenProducto = await supabase
    .from("imagen_producto")
    .select(`id_producto, id_imagen(enlace)`);

  const curated = producto.data?.map((producto) => {
    const imagenes = imagenProducto.data?.filter(
      (imagen) => imagen.id_producto === producto.id
    );

    const enlaces = imagenes?.map((imagen: any) => imagen.id_imagen.enlace);

    return {
      ...producto,
      imagenes: enlaces,
    };
  });

  const post = publicaciones.data?.map((publicacion: any) => {
    return {
      ...publicacion,
      id_imagen: publicacion.id_imagen.enlace,
    };
  });

  console.log(post);

  return {
    props: {
      data: curated,
      posts: post,
    },
  };
};

export default Home;
