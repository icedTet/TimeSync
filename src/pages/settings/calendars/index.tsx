import { GetServerSideProps } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { getUser } from "../../../utils/ServersideHelpers/getUser";
import Mongo from "../../../utils/Clients/Mongo";
import { getCalendars } from "../../../utils/ServersideHelpers/calUtils";
import { GivenUser } from "../../../utils/types/user";
import { CalendarReference } from "../../../utils/types/calendar";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CalendarEntry } from "../../../components/settings/calendars/CalendarEntry";

export const UserCalendars = (props: {
  user: GivenUser;
  calendars: CalendarReference[];
}) => {
  const { user, calendars } = props;
  return (
    <div className={`w-full grow flex flex-col gap-8 p-8 pt-16`}>
      <div className={`flex flex-col gap-4`}>
        <div
          className={`flex flex-row gap-4 w-full justify-between items-center`}
          onClick={() => {}}
        >
          <span className={`text-gray-900/40 text-sm font-wsans font-medium`}>
            Manage Calendars
          </span>
        </div>
        <div className={`flex flex-col gap-4 z-0 relative p-0 items-center w-full`}>
          <div
            className={`bg-gray-50 p-0 rounded-2xl border border-gray-900/10 flex flex-col w-full overflow-hidden`}
          >
            {props.calendars.map((cal) => (
              <CalendarEntry calendar={cal} />
            ))}
          </div>

          <button
            className={`text-white bg-black px-6 py-3 rounded-3xl text-sm font-wsans flex flex-row gap-2`}
          >
            <PlusIcon className={`w-4 h-4`} />
            Add Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCalendars;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = await getUserID(context.req);
  if (userID) {
    const user = await getUser(userID);
    const calendars = await getCalendars(userID);

    delete user?.password;
    return {
      props: {
        user: user,
        calendars: calendars,
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
