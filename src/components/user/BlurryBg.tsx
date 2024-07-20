import { PublicUser } from "../../utils/types/user";
import { createPortal } from "react-dom";
import { UserProfile } from "./UserProfile";
import { useState, useEffect } from "react";
export const BlurryBg = (props: { user: PublicUser }) => {
  const { user } = props;
  const [document, setDocument] = useState(null as Document | null);
  useEffect(() => {
    setDocument(window.document);
  }, []);
  if (!document) return null;
  return createPortal(
    <>
      <UserProfile
        user={user}
        className={
          "h-full w-screen !text-xs !rounded-none z-0 !fixed top-0 left-0 blur-lg scale-110 opacity-60 lg:block hidden  "
        }
      />
      <div
        
        className={
          "h-full w-screen bg-gradient-to-b from-white/50 to-white/90 z-[1] !fixed top-0 left-0"
        }
      />
    </>,
    document?.getElementById(`__next`)!
  );
};
