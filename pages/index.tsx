import useEmblaCarousel from "embla-carousel-react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import BlogFeed from "../components/BlogFeedHome";
import Product from "../components/Product";
import styles from "../styles/Home.module.css";
import { Producto, Publicación } from "../types";
import ProductService from "../utilities/productService";
import PublicationService from "../utilities/publicationService";
import { useRouter } from "next/router";

const Home: NextPage = ({ data, posts }: any) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    loop: true,
  });
  const [emblaRefTwo, emblaApiTwo] = useEmblaCarousel({ slidesToScroll: 1 });
  const [products] = useState<Producto[]>(
    data?.rows?.filter((p: any) => p.esPúblico === true) || []
  );
  const [publications] = useState<Publicación[]>(
    posts?.rows?.filter((p: any) => p.esPública === true) || []
  );
  const router = useRouter();

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

  const formatter = new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
  });

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
            <h2>Soporte Técnico</h2>
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
            <h2>Redes Informáticas</h2>
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
      <section className={styles["call-to-action"]}>
        <div>
          <div>¿Quieres agendar un servicio con nosotros?</div>
          <button onClick={() => {
            router.push("/portal/inicio#nuevo")
          }}>Haz click aquí</button>
        </div>
      </section>
      {products.length > 0 ? (
        <section className={styles.information}>
          <h2 className={styles["information-header"]}>Productos recientes</h2>
          <div className={styles["line-break"]}></div>
          <div className={styles["information-container"]}>
            <div className={styles.embla}>
              <div className={styles["embla__viewport"]} ref={emblaRef}>
                <div className={styles["embla__container"]}>
                  {products?.map((data) => {
                    return (
                      <div className={styles["embla__slide"]} key={data?.id}>
                        <Product
                          title={data?.nombre}
                          price={formatter.format(data?.precio)}
                          image={
                            data?.imagens?.[0]?.url ||
                            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
                          }
                          id={data?.slug}
                          key={data?.id}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <button className={styles.prev} onClick={scrollPrev}>
              <picture className={styles["btn-icon"]}>
                <source srcSet="/left.svg" type="image/svg" />
                <img src="/left.svg" alt="Whats App" />
              </picture>
            </button>
            <button className={styles.next} onClick={scrollNext}>
              <picture className={styles["btn-icon"]}>
                <source srcSet="/right.svg" type="image/svg" />
                <img src="/right.svg" alt="Whats App" />
              </picture>
            </button>
          </div>
        </section>
      ) : null}
      {publications.length > 0 ? (
        <section className={styles.information}>
          <h2 className={styles["information-header"]}>
            Publicaciones recientes
          </h2>
          <div className={styles["line-break"]}></div>
          <div className={styles["information-container"]}>
            <div className={styles.embla}>
              <div className={styles["embla__viewport"]} ref={emblaRefTwo}>
                <div className={styles["embla__container"]}>
                  {publications?.map((post) => {
                    return (
                      <div className={styles["embla__slide"]} key={post?.id}>
                        <BlogFeed
                          titulo={post?.título}
                          fecha={String(post?.creada).slice(0, 10)}
                          imagen={
                            post?.imagen?.url ||
                            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
                          }
                          id={post?.slug}
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
              <picture className={styles["btn-icon"]}>
                <source srcSet="/left.svg" type="image/svg" />
                <img src="/left.svg" alt="Whats App" />
              </picture>
            </button>
            <button className={styles.next} onClick={scrollNextTwo}>
              <picture className={styles["btn-icon"]}>
                <source srcSet="/right.svg" type="image/svg" />
                <img src="/right.svg" alt="Whats App" />
              </picture>
            </button>
          </div>
        </section>
      ) : null}
      {products.length === 0 && publications.length === 0 ? (
        <div className={styles.below}></div>
      ) : null}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const producto = await ProductService.getAll(1, 15);
  const posts = await PublicationService.getAll(1, 15);

  return {
    props: {
      data: producto,
      posts: posts,
    },
  };
};

export default Home;
