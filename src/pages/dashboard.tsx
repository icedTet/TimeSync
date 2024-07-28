import { GetServerSideProps } from "next/types";
import { getUserID } from "../utils/Clients/AuthManager";
import { useSelf } from "../utils/ClientsideHelpers/useSelf";
import { getUser } from "../utils/ServersideHelpers/getUser";
import { GivenUser } from "../utils/types/user";
import { PlannedEvent } from "../utils/types/calendar";
import {
  EventDetailCard,
  EventMiniCard,
} from "../components/dashboard/EventDetailCard";
import { createDate } from "../utils/ServersideHelpers/MiniLib";
import { isWithinInterval } from "date-fns";
import { useAPIProp } from "../utils/useProp";
import Link from "next/link";

export const Dashboard = (props: { user: GivenUser }) => {
  const user = useSelf(props.user);
  const [pendingEvents, refreshEventInvites] = useAPIProp<PlannedEvent[]>({
    APIPath: "/api/events/getEventInvites",
    defaultValue: [],
  });
  const [acceptedEvents, refreshAcceptedEvents] = useAPIProp<PlannedEvent[]>({
    APIPath: "/api/events/getEvents",
    defaultValue: [],
  });

  const currentEvent = acceptedEvents?.[0];
  return (
    <div className={`w-full grow flex flex-col gap-8 p-8 pt-16`}>
      <h1 className={`text-xl font-poppins font-normal text-gray-500`}>
        Hello{" "}
        <b className={`font-extrabold text-gray-800`}>{user?.firstName}</b> 👋
      </h1>{" "}
      <div className={`flex flex-col gap-4`}>
        <div
          className={`flex flex-row gap-4 w-full justify-between items-center`}
          onClick={() => {}}
        >
          <span className={`text-gray-900/40 text-sm font-wsans`}>
            {isWithinInterval(new Date(), {
              start: currentEvent?.start,
              end: currentEvent?.end,
            })
              ? "Current Event 🎉"
              : "Next Event 📆"}
          </span>
        </div>
        <div className={`flex flex-col gap-4 z-0 relative p-0 items-center`}>
          {currentEvent && (
            <Link href={`/events/${currentEvent._id}`} className={`w-full`}>
              <EventMiniCard event={currentEvent} className={`w-full`} />
            </Link>
          )}
        </div>
      </div>
      <div className={`flex flex-col gap-1`}>
        <div
          className={`flex flex-row gap-4 w-full justify-between items-center`}
          onClick={() => {}}
        >
          <span className={`text-gray-900/40 text-sm font-wsans`}>
            Pending Invitations ({pendingEvents?.length}) 📬
          </span>
        </div>
        <div
          className={`flex flex-col gap-4 z-0 relative p-4 bg-gray-50 rounded-2xl border border-gray-900/5 items-center`}
        >
          {pendingEvents?.[0] && (
            <Link href={`/events/${pendingEvents[0]._id}`} className={`w-full`}>
              <EventDetailCard event={pendingEvents[0]} className={`w-full`} />
            </Link>
          )}

          {pendingEvents?.[1] && (
            <>
              <span className={`text-gray-900/20 text-sm font-wsans w-fit`}>
                {" "}
                or{" "}
              </span>
              <button
                className={`w-full bg-black rounded-full p-2.5 text-white font-medium`}
              >
                View All ({pendingEvents.length})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

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
