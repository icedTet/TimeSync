import { PencilIcon } from "@heroicons/react/24/outline";
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
    <div className={`flex flex-col gap-8 px-4 py-16`}>
      <UserInfo user={user!} />
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
