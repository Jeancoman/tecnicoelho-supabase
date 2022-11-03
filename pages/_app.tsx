import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import WhatsAppButton from "../components/WhatsAppButton";
import WhatsAppModal from "../components/WhatsAppModal";
import { useState } from "react";
import React from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

function MyApp({ Component, pageProps }: AppProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const path = new RegExp(/\/admin/, "g");
  const adminPath = path.test(router.pathname);
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
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
    </SessionContextProvider>
  );
}

export default MyApp;
