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

const fakeEvent = [
  {
    _id: "1",
    icalID: "1",
    title: "Sunrise Devils Bridge eHike1",
    description: "Hiking at sunrise",
    start: createDate(6, 15, 5, 30),
    end: createDate(6, 15, 8, 30),
    type: "custom",
    pendingMembers: ["669aee1627609eba805dd247"],
    confirmedMembers: ["669b1375968f7ad77647f34c"],
    background: "/demo/hike.jpeg",
    declinedMembers: ["669afe25bf61858effbdf558"],
  },
  {
    _id: "1",
    icalID: "1",
    title: "Sunrise Devils Bridge Hike2",
    description: "Hiking at sunrise",
    start: createDate(6, 15, 5, 30),
    end: createDate(6, 15, 8, 30),
    type: "custom",
    pendingMembers: ["669aee1627609eba805dd247"],
    confirmedMembers: ["669b1375968f7ad77647f34c"],
    background: "/demo/hike.jpeg",
    declinedMembers: ["669afe25bf61858effbdf558"],
  },
  {
    _id: "1",
    icalID: "1",
    title: "Sunrise Devils Bridge Hike3",
    description: "Hiking at sunrise",
    start: createDate(6, 15, 5, 30),
    end: createDate(6, 15, 8, 30),
    type: "custom",
    pendingMembers: ["669aee1627609eba805dd247"],
    confirmedMembers: ["669b1375968f7ad77647f34c"],
    background: "/demo/hike.jpeg",
    declinedMembers: ["669afe25bf61858effbdf558"],
  },
] as PlannedEvent[];
const fakeEvent2 = {
  _id: "1",
  icalID: "1",
  title: "Pranav's Birthday Party",
  description: "Hiking at sunrise",
  start: createDate(5, 9, 18, 30),
  end: createDate(5, 9, 22, 30),
  type: "custom",
  pendingMembers: [],
  confirmedMembers: [
    "669aee1627609eba805dd247",
    "669b1375968f7ad77647f34c",
    "669afe25bf61858effbdf558",
  ],
  background: "/demo/act2.jpg",
  declinedMembers: [],
} as PlannedEvent;
export const Dashboard = (props: { user: GivenUser }) => {
  const user = useSelf(props.user);
  const [pendingEvents,refreshEventInvites] = useAPIProp<PlannedEvent[]>({
    APIPath: "/api/events/getEventInvites",
    defaultValue: [],
  });
  const currentEvent = fakeEvent2;
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
            <EventMiniCard event={currentEvent} className={`w-full`} />
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
            <EventDetailCard event={pendingEvents[0]} className={`w-full`} />
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
