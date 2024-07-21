import "@/styles/globals.css";
import "@/styles/createEvent.css";
import type { AppProps } from "next/app";
import { BottomBar } from "../components/BottomBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`w-screen h-screen flex flex-col`} id="root">
      {/* <Navbar /> */}
      <Component {...pageProps} />
      <BottomBar />
    </div>
  );
}
