import { GetServerSideProps } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { getUser } from "../../../utils/ServersideHelpers/getUser";
import Mongo from "../../../utils/Clients/Mongo";
import { getCalendars } from "../../../utils/ServersideHelpers/calUtils";
import { GivenUser } from "../../../utils/types/user";
import { CalendarReference } from "../../../utils/types/calendar";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

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
        <div className={`flex flex-col gap-4 z-0 relative p-0 items-center`}>
          {props.calendars.map((calendar) => {
            const [calLink, setCalLink] = useState(calendar.iCalSource);
            return (
              <div
                key={calendar._id}
                className={`flex flex-col gap-4 w-full justify-between items-start p-6 border border-gray-900/10 bg-gray-100 rounded-2xl`}
              >
                <div
                  className={`flex flex-row gap-4 items-center justify-between w-full`}
                >
                  <span
                    className={`text-gray-900/80 text-lg font-poppins font-bold`}
                  >
                    {calendar.title}
                  </span>
                  <button
                    className={`text-white bg-black p-2 rounded-xl text-sm font-wsans`}
                  >
                    <TrashIcon className={`w-6 h-6`} />
                  </button>
                </div>
                <input
                  type="text"
                  value={calLink}
                  onChange={(e) => setCalLink(e.target.value)}
                  className={`w-full bg-gray-50 p-2 rounded-xl border border-gray-900/10`}
                />
                {calLink !== calendar.iCalSource && (
                  <div className={`flex flex-row gap-4 w-full justify-end`}>
                    <button
                      className={`text-gray-900/40 p-2 rounded-xl text-sm font-wsans`}
                      onClick={() => setCalLink(calendar.iCalSource)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`text-white bg-black px-6 py-2.5 rounded-3xl text-sm font-wsans`}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
