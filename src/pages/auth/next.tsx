import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect } from "react";
import styles from "../../styles/registration.module.css";
import { getUserID } from "../../utils/Clients/AuthManager";
import { getUser } from "../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../utils/types/user";
import { useSelf } from "../../utils/ClientsideHelpers/useSelf";
import { Encryptions } from "../../utils/classes/Encryptions";
export const NextSteps = (props: { user?: GivenUser }) => {
  const router = useRouter();
  const user = useSelf(props.user);
  useEffect(() => {
    if (router.query.token) {
      localStorage.setItem("token", router.query.token as string);
    }
  }, [router]);
  return (
    <div className="w-full min-h-screen relative">
      hi! {user?.firstName} {JSON.stringify(user)}
    </div>
  );
};
export default NextSteps;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token;
  if (!token) {
    return {
      redirect: {
        destination: "/auth/login?error=missing_token",
        permanent: false,
      },
    };
  }
  const userID = (await Encryptions.decryptUserToken(token as string).catch(
    () => null
  )) as string | null;
  console.log(userID, context);
  if (userID) {
    const user = await getUser(userID);
    context.res.setHeader(
      "Set-Cookie",
      `auth_cookie=${context.query.token};Max-Age=2592000;Path=/;SameSite=Strict`
    );
    console.log(user);
    return {
      props: {
        user: user,
      },
    };
  }
  return {
    props: {},
  };
  // ...
};
