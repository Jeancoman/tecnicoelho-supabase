import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/AdminPanel.module.css";
import cn from "classnames";
import { supabase } from "../utilities/supabaseClient";

const AdminPanel = () => {
  const router = useRouter();

  const onClick = async () => {
    await supabase.auth.signOut();
    router.push("/")
  }

  return (
    <aside className={styles.dashboard}>
      <div>
        <div className={styles.container}>
          <Link href={"/admin/posts"}>
            <div
              className={cn({
                [styles.icon]: !(router.pathname === "/admin/posts"),
                [styles["icon"] + " " + styles["active"]]: router.pathname === "/admin/posts",
              })}
            >
              <div>
                <picture>
                  <source srcSet="/newspaper.svg" type="image/svg" />
                  <img
                    src="/newspaper.svg"
                    alt="Direcciones"
                    referrerPolicy="no-referrer"
                  />
                </picture>
              </div>
              <p>Publicaciones</p>
            </div>
          </Link>
          <Link href={"/admin/products"}>
            <div className={cn({
                [styles.icon]: !(router.pathname === "/admin/products"),
                [styles["icon"] + " " + styles["active"]]: router.pathname === "/admin/products",
              })}>
              <div>
                <picture>
                  <source srcSet="/gift.svg" type="image/svg" />
                  <img
                    src="/gift.svg"
                    alt="Direcciones"
                    referrerPolicy="no-referrer"
                  />
                </picture>
              </div>
              <p>Productos</p>
            </div>
          </Link>
          <Link href={"/admin/products"}>
            <div className={styles.icon}>
              <div>
                <picture>
                  <source srcSet="/images.svg" type="image/svg" />
                  <img
                    src="/images.svg"
                    alt="Direcciones"
                    referrerPolicy="no-referrer"
                  />
                </picture>
              </div>
              <p>Galería</p>
            </div>
          </Link>
          <div className={styles.icon}>
            <div>
              <picture>
                <source srcSet="/logout.svg" type="image/svg" />
                <img
                  src="/logout.svg"
                  alt="Direcciones"
                  referrerPolicy="no-referrer"
                />
              </picture>
            </div>
            <p>Cerrar sesión</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminPanel;
