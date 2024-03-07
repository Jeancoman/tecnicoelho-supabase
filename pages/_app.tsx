import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import WhatsAppButton from "../components/WhatsAppButton";
import WhatsAppModal from "../components/WhatsAppModal";
import { useState } from "react";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const path = new RegExp(/\/portal\/dashboard/, "g");
  const adminPath = path.test(router.pathname);

  return (
    <>
      {!adminPath && (
        <>
          <Header />
        </>
      )}
      <Component {...pageProps} />
      {!adminPath && (
        <>
          <WhatsAppButton showModal={showModal} setShowModal={setShowModal} />
          <WhatsAppModal showModal={showModal} setShowModal={setShowModal} />
          <Footer />
        </>
      )}
    </>
  );
}

export default MyApp;
