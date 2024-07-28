import { useEffect, useRef } from "react";
import { configureColor } from "../utils/nprogress";

export const ProgressBar = () => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    configureColor(divRef.current!.className);
  }, [divRef]);
  return (
    <div
      className={`!bg-gradient-to-r !from-indigo-400 !via-purple-300 !to-pink-300 !h-1`}
      ref={divRef}
      role="bar"
      style={{
        position: "fixed",
        bottom: "0px!important",
        zIndex: 9999,
        display: "none!important",
      }}
    ></div>
  );
};
export default ProgressBar;
