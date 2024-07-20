import {
  CalendarIcon,
  HomeIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "./BottomBar/NavLink";
import Link from "next/link";
import { UserProfile } from "./user/UserProfile";
import { useSelf } from "../utils/ClientsideHelpers/useSelf";

export const BottomBar = () => {
  const user = useSelf();
  return (
    <div className="fixed bottom-0 left-0 w-full p-4 pb-6 backdrop-blur-lg bg-gradient-to-b from-white/0 to-white via-white/50">
      <div
        className={`bg-white h-20 rounded-[28px] shadow-lg flex flex-row items-center justify-evenly`}
      >
        <NavLink
          href="/dashboard"
          name="Home"
          icon={(props) => <HomeIcon {...props} />}
        />
        <NavLink
          href="/friends"
          name="Home"
          icon={(props) => <UserGroupIcon {...props} />}
        />
        <button className="w-16 h-16 rounded-full bg-gray-900 flex flex-row items-center justify-center">
          <PlusIcon className="w-8 h-8 text-gray-100" />
        </button>
        <NavLink
          href="/calendar"
          name="Home"
          icon={(props) => <CalendarIcon {...props} />}
        />
        <Link href="/settings">
          <div className="w-12 h-12 rounded-full bg-gray-900/10">
            {user && <UserProfile user={user} pfp={user.pfp} className={"w-12 h-12 rounded-2xl border-gray-200 border text-sm"} />}
          </div>
        </Link>
      </div>
    </div>
  );
};
