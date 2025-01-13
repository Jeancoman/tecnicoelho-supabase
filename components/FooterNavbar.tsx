/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import styles from "../styles/FooterNavbar.module.css";
import session from "../utilities/sessionService";
import { useRouter } from "next/router";

type Footer = {
    setIsOpen: (value: boolean) => void;
};

const FooterNavbar = ({ setIsOpen }: Footer) => {
    const router = useRouter();

    return (
        <footer className={styles.footer}>
            <div className={styles["content"]}>
                <div
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    <img src="/list_alt.svg" />
                </div>
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
