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
import ListParent from "../../components/settings/ListParent";
import { ListEntry } from "../../components/settings/ListComponent/ListEntry";

export const UserAppearance = (props: { user: GivenUser }) => {
  const user = useSelf(props.user);
  const router = useRouter();
  return (
    <div className={`flex flex-col gap-8 px-4 pt-16 w-full grow`}>
      <UserInfo user={user!} />
      <ListParent>
        <ListEntry toLink="/settings/calendars">
            Manage Calendars
        </ListEntry>
      </ListParent>
      <ListParent>
        <ListEntry disabled>
            Join Discord
        </ListEntry>
        <ListEntry disabled>
            Sign Out
        </ListEntry>
      </ListParent>
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
