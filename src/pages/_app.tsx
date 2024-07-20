import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BottomBar } from "../components/BottomBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`w-screen h-screen bg-gray-100`} id="root">
      {/* <Navbar /> */}
      <Component {...pageProps} />
      <BottomBar />
    </div>
  );
}
