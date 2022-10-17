import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = new RegExp(/\/admin/, "g");
  const inAdminPath = path.test(router.pathname);

  return (
    <>
        {!inAdminPath && (
          <>
            <Header />
          </>
        )}
        <Component {...pageProps} />
        {!inAdminPath && (
            <Footer />
        )}
    </>
  );
}

export default MyApp;
