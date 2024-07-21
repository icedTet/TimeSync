import { format } from "date-fns";
import { PlannedEvent } from "../../utils/types/calendar";
import { useEffect, useState } from "react";
import { PublicUser } from "../../utils/types/user";
import { SelfUserClass } from "../../utils/classes/UserClass";
import { UserProfile } from "../user/UserProfile";
import { CalendarDaysIcon, ChevronRightIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const EventDetailCard = (props: {
  event: PlannedEvent;
  className?: string;
}) => {
  const { event, className } = props;
  const [userMap, setuserMap] = useState(new Map<string, PublicUser>());
  useEffect(() => {
    const members = event.pendingMembers
      .concat(event.confirmedMembers)
      .concat(event.declinedMembers);
    members.forEach(async (member) => {
      SelfUserClass.getInstance()
        .getUser(member)
        .then((user) => {
          setuserMap((prev) => new Map(prev.set(member, user!)));
        });
    });
  }, [event]);
  return (
    <div
      className={`flex flex-col gap-2 p-4 px-6 relative overflow-hidden rounded-2xl border border-gray-900/10 shadow-lg drop-shadow-md ${className}`}
    >
      <div className={`flex flex-row gap-4 z-10 relative items-center`}>
        {/* <div
          className={`flex flex-col gap-0 w-16 h-16 items-center justify-center bg-gray-100/50 backdrop-blur-xl rounded-xl`}
        >
          <span className={`text-gray-900/40 text-md font-medium font-wsans`}>
            {months[props.event.start.getMonth()]}
          </span>
          <span
            className={`text-gray-900/40 text-xl font-poppins font-extrabold`}
          >
            {props.event.start.getDate()}
          </span>
        </div> */}
        <div className={`flex flex-col gap-0 relative z-10 w-full`}>
          <span
            className={`text-gray-900/50 text-base font-wsans px-4 py-1 bg-gray-50/80 rounded-full w-fit flex flex-row items-center gap-1 mb-2`}
          >
            <CalendarDaysIcon className={`w-4 h-4 inline-block mr-1`} />
            {format(props.event.start, "MMM dd, yyyy")}
          </span>
          <span className={`text-gray-900/50 text-sm font-wsans`}>
            {/* get start time and end time */}
          </span>
          <h1
            className={`text-lg font-poppins font-bold text-gray-900/90 w-full`}
          >
            {props.event.title}
          </h1>
          <span className={`text-gray-900/60 text-sm font-wsans`}>
            {format(props.event.start, "hh:mm a")} -{" "}
            {format(props.event.end, "hh:mm a")}
          </span>
          <div className={`flex flex-row gap-1 w-full justify-end`}>
            <div className={`flex flex-row`}>
              {props.event.confirmedMembers.map((member, i) => (
                <UserProfile
                  user={userMap.get(member)!}
                  key={member}
                  className={
                    "w-8 h-8 border border-green-400 text-xs rounded-full first:ml-0 -ml-4"
                  }
                  style={{ zIndex: i }}
                />
              ))}
              {props.event.pendingMembers.map((member, i) => (
                <UserProfile
                  user={userMap.get(member)!}
                  key={member}
                  className={
                    "w-8 h-8 border border-yellow-400 text-xs rounded-full first:ml-0 -ml-4"
                  }
                  style={{
                    zIndex: i + props.event.confirmedMembers.length,
                  }}
                />
              ))}
              {props.event.declinedMembers.map((member, i) => (
                <UserProfile
                  user={userMap.get(member)!}
                  key={member}
                  className={
                    "w-8 h-8 border border-red-400 text-xs rounded-full first:ml-0 -ml-4"
                  }
                  style={{
                    zIndex:
                      i +
                      props.event.confirmedMembers.length +
                      props.event.pendingMembers.length,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`absolute top-0 right-0 w-full h-full `}>
        <div className={`relative top-0 left-0 w-full h-full z-0`}>
          <div
            className={`bg-gradient-to-b from-gray-100/50 to-gray-100/80 via-gray-100/70 w-full h-full z-10 relative`}
          />
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-md
            bg-cover bg-center w-[110%] h-[110%] 
        `}
            style={{
              backgroundImage: `url(${props.event.background})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export const EventMiniCard = (props: {
  event: PlannedEvent;
  className?: string;
}) => {
  const { event, className } = props;
  return (
    <div
      className={`flex flex-col gap-2 p-4 px-6 relative overflow-hidden rounded-2xl border border-gray-900/10 shadow-lg drop-shadow-md ${className}`}
    >
      <div className={`flex flex-row gap-4 z-10 relative items-center`}>
        {/* <div
              className={`flex flex-col gap-0 w-16 h-16 items-center justify-center bg-gray-100/50 backdrop-blur-xl rounded-xl`}
            >
              <span className={`text-gray-900/40 text-md font-medium font-wsans`}>
                {months[props.event.start.getMonth()]}
              </span>
              <span
                className={`text-gray-900/40 text-xl font-poppins font-extrabold`}
              >
                {props.event.start.getDate()}
              </span>
            </div> */}
        <div className={`flex flex-col gap-0 relative z-10 w-full`}>
          <span
            className={`text-gray-900/70 text-sm font-wsans rounded-full w-fit flex flex-row items-center gap-1 `}
          >
            <ClockIcon className={`w-4 h-4 inline-block mr-1`} />
            {format(props.event.start, "hh:mm a")} -{" "}
            {format(props.event.end, "hh:mm a")} |{" "}
            {format(props.event.start, "MMM dd")}
          </span>
          <span className={`text-gray-900/50 text-sm font-wsans`}>
            {/* get start time and end time */}
          </span>
          <h1
            className={`text-lg font-poppins font-bold text-gray-900/90 w-full whitespace-nowrap truncate`}
          >
            {props.event.title}
          </h1>
          <span
            className={`text-gray-900/70 text-sm font-wsans rounded-full w-fit flex flex-row items-center gap-1`}
          >
            <UserGroupIcon className={`w-4 h-4 inline-block mr-1`} />
            {props.event.confirmedMembers.length}
          </span>
        </div>
        <ChevronRightIcon className={`w-4 h-4 text-gray-900/30`} />
      </div>
      <div className={`absolute top-0 right-0 w-full h-full `}>
        <div className={`relative top-0 left-0 w-full h-full z-0`}>
          <div
            className={`bg-gradient-to-b from-gray-100/50 to-gray-100/80 via-gray-100/70 w-full h-full z-10 relative`}
          />
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-md
                bg-cover bg-center w-[110%] h-[110%] 
            `}
            style={{
              backgroundImage: `url(${props.event.background})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
