import Link from "next/link";
import styles from "../styles/AdminPanel.module.css";

const AdminPanel = () => {
    return (
      <aside className={styles.dashboard}>
        <div>
          <h2>Panel de Control</h2>
          <div className={styles.container}>
            <Link href={"/admin/posts"}>
              <div className={styles.icon}>
                <div>
                  <picture>
                    <source srcSet="/feed.svg" type="image/svg" />
                    <img
                      src="/feed.svg"
                      alt="Direcciones"
                      referrerPolicy="no-referrer"
                    />
                  </picture>
                </div>
                <p>Publicaciones</p>
              </div>
            </Link>
            <Link href={"/admin/products"}>
              <div className={styles.icon}>
                <div>
                  <picture>
                    <source srcSet="/warehouse.svg" type="image/svg" />
                    <img
                      src="/warehouse.svg"
                      alt="Direcciones"
                      referrerPolicy="no-referrer"
                    />
                  </picture>
                </div>
                <p>Productos</p>
              </div>
            </Link>
            <Link href={"/admin/users"}>
              <div className={styles.icon}>
                <div>
                  <picture>
                    <source srcSet="/users.svg" type="image/svg" />
                    <img
                      src="/users.svg"
                      alt="Direcciones"
                      referrerPolicy="no-referrer"
                    />
                  </picture>
                </div>
                <p>Usuarios</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    );
  };

  export default AdminPanel;