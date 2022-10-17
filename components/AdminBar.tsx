import Link from "next/link";
import styles from "../styles/AdminBar.module.css";

const AdminBar = () => {
    return (
        <div className={styles.bar}>
            <Link href={"/admin"}>
                <a>
                    Panel de Control
                </a>
            </Link>

        </div>
    )

}

export default AdminBar;