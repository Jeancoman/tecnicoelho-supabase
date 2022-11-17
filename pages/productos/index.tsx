import type { GetStaticProps, NextPage } from "next";
import styles from "/styles/Products.module.css";
import Product from "../../components/Product";
import { supabase } from "../../utilities/supabaseClient";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";

const Products: NextPage = ({ data }: any) => {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(8);
  const [products, setProducts] = useState(data);
  const [productsEnd, setProductsEnd] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [paginating, setPaginating] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [show, setShow] = useState(true);

  const nextPage = () => {
    setFrom(from + 9);
    setTo(to + 9);
    setPaginating(true);
  };

  const previousPage = () => {
    setFrom(from - 9);
    setTo(to - 9);
    setPaginating(true);
    setProductsEnd(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Backspace") {
      setSearchInput("");
      fetchProducts();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchProducts = useCallback(
    debounce(async (searchFor: string) => {
      const { data, error } = await supabase
        .from("producto")
        .select()
        .textSearch("nombre", `${searchFor}`, {
          type: "websearch",
          config: "english",
        });

      if (data?.length === 0) {
        const { data, error } = await supabase
          .from("producto")
          .select()
          .textSearch("descripción", `${searchFor}`, {
            type: "websearch",
            config: "english",
          });

        const imagenProducto = await supabase
          .from("imagen_producto")
          .select(`id_producto, id_imagen(enlace)`);

        const mapped: any = data?.map((producto: any) => {
          const imagenes: any = imagenProducto.data?.filter(
            (imagen) => imagen.id_producto === producto.id
          );

          const enlaces: any = imagenes?.map(
            (imagen: any) => imagen.id_imagen.enlace
          );

          return {
            ...producto,
            imagenes: enlaces,
          };
        });

        if (mapped?.length === 0) {
          setProducts(undefined);
          setNotFound(true);
          setPaginating(false);
          setShow(false);
        } else {
          setProducts(undefined);
          setProducts(mapped);
          setNotFound(false);
          setPaginating(false);
          setShow(false);
        }
      } else {
        const imagenProducto = await supabase
          .from("imagen_producto")
          .select(`id_producto, id_imagen(enlace)`);

        const mapped: any = data?.map((producto: any) => {
          const imagenes: any = imagenProducto.data?.filter(
            (imagen) => imagen.id_producto === producto.id
          );

          const enlaces: any = imagenes?.map(
            (imagen: any) => imagen.id_imagen.enlace
          );

          return {
            ...producto,
            imagenes: enlaces,
          };
        });

        setProducts(undefined);
        setProducts(mapped);
        setNotFound(false);
        setPaginating(false);
        setShow(false);
      }
    }, 1000),
    []
  );

  const fetchProducts = async () => {
    const { data, count } = await supabase
      .from("producto")
      .select()
      .order("id", { ascending: true })
      .range(from, to);

    const imagenProducto = await supabase
      .from("imagen_producto")
      .select(`id_producto, id_imagen(enlace)`);

    const mapped: any = data?.map((producto: any) => {
      const imagenes: any = imagenProducto.data?.filter(
        (imagen) => imagen.id_producto === producto.id
      );

      const enlaces: any = imagenes?.map(
        (imagen: any) => imagen.id_imagen.enlace
      );

      return {
        ...producto,
        imagenes: enlaces,
      };
    });

    setProducts(undefined);
    setProducts(mapped);
    setPaginating(true);
    setNotFound(false);
    setSearching(false);
    setShow(true);
    mapped?.length < 9 ? setProductsEnd(true) : null;
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    if (searching && searchInput.length > 0) {
      searchProducts(searchInput);
    }
    if (searchInput.length === 0 && products?.length === 0) {
      fetchProducts();
      setNotFound(false);
      setSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    if (paginating) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, paginating, to]);

  return (
    <main className={styles.products}>
      <Head>
        <title>Productos</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles["left-container"]}>
        <input
          type="text"
          name="search_bar"
          id=""
          value={searchInput}
          placeholder="Buscar producto..."
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSearching(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles["right-container"]}>
        <div className={styles.container}>
          {products?.map((data: any) => {
            return (
              <Product
                title={data?.nombre}
                price={formatter.format(data?.precio)}
                image={data?.imagenes[0]}
                id={data?.id}
                key={data?.id}
              />
            );
          })}
          {notFound ? (
            <div className={styles["not-found"]}>
              <h2>¡No se ha encontrado ningun producto!</h2>
              <h3>
                No se han encontrado productos que concuerden con tus términos
                de busqueda. Trata de ser más explicito o ponte en contacto con
                nosotros.
              </h3>
            </div>
          ) : null}
        </div>
        {show ? (
          <div className={styles["pagination"]}>
            <button onClick={previousPage} disabled={from === 0 && to === 8}>
              Pagina previa
            </button>
            <button onClick={nextPage} disabled={productsEnd}>
              Pagina siguiente
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const producto = await supabase
    .from("producto")
    .select()
    .order("id", { ascending: true })
    .range(0, 8);

  const imagenProducto = await supabase
    .from("imagen_producto")
    .select(`id_producto, id_imagen(enlace)`);

  const curated: any = producto.data?.map((producto: any) => {
    const imagenes: any = imagenProducto.data?.filter(
      (imagen) => imagen.id_producto === producto.id
    );

    const enlaces: any = imagenes?.map(
      (imagen: any) => imagen.id_imagen.enlace
    );

    return {
      ...producto,
      imagenes: enlaces,
    };
  });

  return {
    props: {
      data: curated,
    },
  };
};

export default Products;
