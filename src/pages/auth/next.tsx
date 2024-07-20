import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect } from "react";
import styles from "../../styles/registration.module.css";
import { getUserID } from "../../utils/Clients/AuthManager";
import { getUser } from "../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../utils/types/user";
export const NextSteps = (props: { user?: GivenUser }) => {
  const router = useRouter();
  // const user = useSelf(props.user)
  useEffect(() => {
    if (router.query.token) {
      localStorage.setItem("token", router.query.token as string);
    }
  }, [router]);
  return (
    <div className="w-full min-h-screen relative">
     hi!
    </div>
  );
};
export default NextSteps;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = await getUserID(context.req);
  if (userID) {
    const user = await getUser(userID);
    context.res.setHeader(
      "Set-Cookie",
      `auth_cookie=${context.query.token};Max-Age=2592000;Path=/;SameSite=Strict`
    );
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
