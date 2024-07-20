import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`w-screen h-screen bg-gray-50`} id="root">
      {/* <Navbar /> */}
      <Component {...pageProps} />
    </div>
  );
}
