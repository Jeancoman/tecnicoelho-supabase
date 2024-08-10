import type { GetServerSideProps, NextPage } from "next";
import styles from "/styles/Products.module.css";
import Product from "../../components/Product";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Producto } from "../../types";
import ProductService from "../../utilities/productService";

const Products: NextPage = ({ data }: any) => {
  const [page, setPage] = useState(data.current);
  const [pages, setPages] = useState(data.pages);
  const [products, setProducts] = useState<Producto[] | []>(data.rows);
  const [searchInput, setSearchInput] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [show, setShow] = useState(true);

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
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
      const data = await ProductService.getByNombre(searchFor, 1, 100)

      if (data?.rows?.length === 0 || !data?.rows) {
        const otherData = await ProductService.getByDescripcion(searchFor, 1, 100)

        if (otherData?.rows?.length === 0 || !otherData?.rows) {
          setProducts(otherData?.rows || []);
          setNotFound(true);
          setShow(false);
        } else {
          setProducts(otherData?.rows);
          setNotFound(false);
          setShow(false);
        }
      } else {
        setProducts(data?.rows);
        setNotFound(false);
        setShow(false);
      }
    }, 1000),
    []
  );

  const fetchProducts = async () => {
    const data = await ProductService.getAll(page, 9);
    setProducts(data?.rows || []);
    setPages(data?.pages)
    setPage(data?.current)
    setNotFound(false);
    setSearching(false);
    setShow(true);
  };

  const formatter = new Intl.NumberFormat("es-VE", {
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
      fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
          disabled={true}
        />
      </div>
      <div className={styles["right-container"]}>
        <div className={styles.container}>
          {products?.map((data) => {
            return (
              <Product
                title={data?.nombre}
                price={formatter.format(data?.precio)}
                image={data?.imagens?.[0]?.url || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"}
                id={data?.slug}
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
            <button onClick={previousPage} disabled={page === 1}>
              Pagina previa
            </button>
            <button onClick={nextPage} disabled={page === pages}>
              Pagina siguiente
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await ProductService.getAll(1, 9);

  return {
    props: {
      data,
    },
  };
};

export default Products;
