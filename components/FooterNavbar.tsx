import Link from "next/link";
import styles from "../styles/FooterNavbar.module.css";
import session from "../utilities/sessionService";
import { useRouter } from "next/router";

const FooterNavbar = () => {
  const router = useRouter();

  return (
    <footer className={styles.footer}>
      <div className={styles["content"]}>
        <Link href={"/portal/dashboard/tickets/nuevo"}>
          <div><img src="/confirmation_number.svg" /></div>
        </Link>
        <div><img src="/list_alt.svg" /></div>
        <Link href={"/portal/dashboard/elementos"}>
          <div><img src="/devices.svg" /></div>
        </Link>
        <div
          onClick={() => {
            session.revoke();
            router.push("/portal/inicio");
          }}
        >
          <img src="/logout_portal.svg" />
        </div>
      </div>
    </footer>
  );
};

export default FooterNavbar;
