import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/AdminPanel.module.css";
import cn from "classnames";
import { supabase } from "../utilities/supabaseClient";

const AdminPanel = () => {
  const router = useRouter();

  const onClick = async () => {
    const { error } = await supabase.auth.signOut();
    const expires = new Date(0).toUTCString()
    document.cookie = `supabase-auth-token=; path=/; expires=${expires}; SameSite=Lax; secure`
    router.push("/");
  }

  return (
    <aside className={styles.dashboard}>
      <div>
        <div className={styles.container}>
          <Link href={"/admin/publicaciones"}>
            <div
              className={cn({
                [styles.icon]: !(router.pathname === "/admin/publicaciones"),
                [styles["icon"] + " " + styles["active"]]: router.pathname === "/admin/publicaciones",
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
          <Link href={"/admin/productos"}>
            <div className={cn({
                [styles.icon]: !(router.pathname === "/admin/productos"),
                [styles["icon"] + " " + styles["active"]]: router.pathname === "/admin/productos",
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
          <Link href={"/admin/galeria"}>
            <div className={cn({
                [styles.icon]: !(router.pathname === "/admin/galeria"),
                [styles["icon"] + " " + styles["active"]]: router.pathname === "/admin/galeria",
              })}>
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
          <div className={styles.icon} onClick={onClick}>
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
