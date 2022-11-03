import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Head from "next/head";

const Admin: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Panel de Control</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  );
};

export const getServerSideProps = withPageAuth({
  redirectTo: "/admin/login",
  async getServerSideProps() {
    return { props: {}, redirect: { destination: "/admin/posts" } };
  },
});

export default Admin;
