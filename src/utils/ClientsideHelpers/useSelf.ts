import { useEffect, useState } from "react";
import { SelfUserClass } from "../classes/UserClass";
import { GivenUser } from "../types/user";

export const useSelf = (u?: GivenUser) => {
  const [user, setUser] = useState(u ?? (null as GivenUser | null));
  useEffect(() => {
    if (SelfUserClass.getInstance().user)
      setUser(SelfUserClass.getInstance().user);
    const second = (user) => {
      setUser(user);
    };
    SelfUserClass.getInstance().on("change", second);

    return () => {
      SelfUserClass.getInstance().removeListener("change", second);
    };
  }, []);
  return user;
};
