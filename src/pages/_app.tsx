import "@/styles/globals.css";
import "@/styles/createEvent.css";
import "nprogress/nprogress.css";
import type { AppProps } from "next/app";
import { BottomBar } from "../components/BottomBar";
import Head from "next/head";
import ProgressBar from "../components/ProgressBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head key="head">
        {/* fix Page has no manifest <link> URL */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div className={`w-screen h-screen flex flex-col`} id="root">
        <ProgressBar />
        {/* <Navbar /> */}
        <Component {...pageProps} />
        <BottomBar />
      </div>
    </>
  );
}
