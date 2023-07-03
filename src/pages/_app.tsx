import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <ClerkProvider {...pageProps}>
    <Head>
      <title>The stuff store</title>
      <meta name="description" content="Created by create-t3-app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
    <Toaster position="bottom-center" />
  </ClerkProvider>
};

export default api.withTRPC(MyApp);
