import { ChevronRightIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect, useRef, useState } from "react";
// import { UpdateProfileModal } from "../../components/hiddens/UpdateProfileModal";
import { UserProfile } from "../../components/user/UserProfile";
import { SelfUserClass } from "../../utils/classes/UserClass";
import { getUserID } from "../../utils/Clients/AuthManager";
import { useSelf } from "../../utils/ClientsideHelpers/useSelf";
import { getUser } from "../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../utils/types/user";
import { UserInfo } from "../../components/settings/UserInfo";

export const UserAppearance = (props: { user: GivenUser }) => {
  const user = useSelf(props.user);
  return (
    <div className={`flex flex-col gap-8 px-4 pt-16 w-full grow`}>
      <UserInfo user={user!} />
      <div
        className={`bg-gray-50 p-1 rounded-2xl border border-gray-900/10 flex flex-col`}
      >
        <div
          className={`flex flex-row gap-4 items-center text-gray-700 w-full justify-between p-3 px-6 border-b`}
        >
          <span className={` text-sm font-medium font-wsans`}>
            Join Discord
          </span>
          <ChevronRightIcon className={`w-4 h-4 `} />
        </div>
        <div
          className={`flex flex-row gap-4 items-center text-red-400 w-full justify-between p-3 px-6`}
        >
          <span className={` text-sm font-medium font-wsans`}>Sign Out</span>
          <ChevronRightIcon className={`w-4 h-4 `} />
        </div>
      </div>
      <div className={`w-full grow`} />
      <div className={`flex flex-col gap-1`}>
        <span className={`text-gray-900/20 text-xs font-wsans`}>
          Version 0.0.4-BETA
        </span>
        <span className={`text-gray-900/20 text-xs font-wsans`}>
          © 2024 - 2024
        </span>
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = await getUserID(context.req);
  if (userID) {
    const user = await getUser(userID);
    delete user?.password;
    return {
      props: {
        user: user,
      },
    };
  }
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
  // ...
};
export default UserAppearance;
