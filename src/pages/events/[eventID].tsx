import { GetServerSideProps } from "next";
import { getUserID } from "../../utils/Clients/AuthManager";
import { cleanUser, getUser } from "../../utils/ServersideHelpers/getUser";
import { getEvent } from "../../utils/ServersideHelpers/eventUtils";
import { useSelf } from "../../utils/ClientsideHelpers/useSelf";
import { GivenUser, PublicUser } from "../../utils/types/user";
import { PlannedEvent } from "../../utils/types/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { UserProfile } from "../../components/user/UserProfile";
import { Modal } from "../../components/Modal";
import {
  ArrowLeftEndOnRectangleIcon,
  CheckBadgeIcon,
  EnvelopeOpenIcon,
  EyeIcon,
  MinusCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BsDashCircle } from "react-icons/bs";
import { fetcher } from "../../utils/fetcher";
import { useNProgress } from "../../utils/nprogress";

export const EventPage = (props: {
  user: GivenUser;
  event: PlannedEvent & {
    start: string;
    end: string;
  };
  users: Record<string, PublicUser | null>;
}) => {
  const { user, event: eventResource, users } = props;
  const self = useSelf(user);
  const [event, setEvent] = useState(null as PlannedEvent | null);
  const [viewParticipants, setViewParticipants] = useState(false);
  const { observe } = useNProgress();
  useEffect(() => {
    if (eventResource) {
      setEvent({
        ...eventResource,
        start: new Date(eventResource.start),
        end: new Date(eventResource.end),
      });
    }
  }, [eventResource]);
  if (!event) {
    return <div></div>;
  }
  return (
    <>
      <Modal
        visible={viewParticipants}
        onClose={() => setViewParticipants(false)}
        className={`w-[calc(100%-4rem)] py-8 px-8 flex flex-col gap-4`}
      >
        <div className={`flex flex-col gap-4 w-full`}>
          <div className={`flex flex-col gap-2 z-0 relative p-0 items-center `}>
            <span
              className={`text-gray-900 text-lg font-poppins font-bold w-full`}
            >
              Participant List (
              {event?.confirmedMembers.length +
                event?.pendingMembers.length +
                event?.declinedMembers.length}
              )
            </span>
            <div className={`flex flex-col gap-2 w-full items-start px-4`}>
              <div className={`flex flex-col gap-2 w-full items-start`}>
                {event?.confirmedMembers.map((member) => (
                  <div
                    className={`flex flex-row gap-4 w-full items-center`}
                    key={member}
                  >
                    <UserProfile
                      user={users[member]!}
                      className={`w-10 h-10 rounded-full bg-gray-50/50 text-sm ring ring-emerald-400`}
                    />
                    <div className={`flex flex-col gap-0 grow`}>
                      <span
                        className={`text-gray-900/80 text-lg font-bold font-poppins`}
                      >
                        {users[member]?.firstName} {users[member]?.lastName}
                      </span>
                      <span className={`text-gray-900/50 text-sm font-wsans`}>
                        @{users[member]?.username}
                      </span>
                    </div>
                    <CheckBadgeIcon className={`w-6 h-6 text-emerald-400`} />
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex flex-col gap-2 w-full items-start px-4`}>
              <div className={`flex flex-col gap-2 w-full items-start`}>
                {event?.pendingMembers.map((member) => (
                  <div
                    className={`flex flex-row gap-4 w-full items-center opacity-60`}
                    key={member}
                  >
                    <UserProfile
                      user={users[member]!}
                      className={`w-10 h-10 rounded-full bg-gray-50/50 text-sm ring ring-yellow-500`}
                    />
                    <div className={`flex flex-col gap-0 grow`}>
                      <span
                        className={`text-gray-900/80 text-lg font-bold font-poppins`}
                      >
                        {users[member]?.firstName} {users[member]?.lastName}
                      </span>
                      <span className={`text-gray-900/50 text-sm font-wsans `}>
                        @{users[member]?.username}
                      </span>
                    </div>
                    <MinusCircleIcon className={`w-6 h-6 text-yellow-500`} />
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex flex-col gap-4 w-full items-start px-4`}>
              <div
                className={`flex flex-col gap-2 w-full items-start opacity-50`}
              >
                {event?.declinedMembers.map((member) => (
                  <div
                    className={`flex flex-row gap-4 w-full items-center`}
                    key={member}
                  >
                    <UserProfile
                      user={users[member]!}
                      className={`w-10 h-10 rounded-full bg-gray-50/50 text-sm ring ring-red-400`}
                    />
                    <div className={`flex flex-col gap-0 grow`}>
                      <span
                        className={`text-gray-900/80 text-lg font-bold font-poppins`}
                      >
                        {users[member]?.firstName} {users[member]?.lastName}
                      </span>
                      <span className={`text-gray-900/50 text-sm font-wsans`}>
                        @{users[member]?.username}
                      </span>
                    </div>
                    <XCircleIcon className={`w-6 h-6 text-red-400`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {event?.background && (
        <div className={`w-full h-full fixed top-0 left-0`}>
          <div
            className={`w-full h-full relative top-0 left-0 overflow-hidden`}
          >
            <div
              className={`w-[120%] h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cover blur-lg transition-all duration-300`}
              style={{
                backgroundImage: `url(${event?.background})`,
              }}
            >
              <div
                className={`w-full h-full bg-gradient-to-b from-gray-50/20 to-gray-50/90 via-gray-50/80`}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className={`w-full grow flex flex-col gap-8 p-8 pt-16 relative z-10`}
      >
        <div
          className={`flex flex-row gap-4 w-full h-28 bg-gray-50/50 relative rounded-3xl overflow-hidden`}
        >
          <div className={`flex flex-row gap-4`}>
            <div
              className={` bg-gray-50/50 w-20 h-20 ml-4 mt-4 rounded-xl flex flex-col gap-2 relative overflow-hidden`}
            >
              <div
                className={`w-full h-6 top-0 left-0 absolute bg-red-500 opacity-70 blur-sm`}
              />
              <div
                className={`w-full h-4 rounded-none z-10 relative font-bold flex flex-row items-center justify-center text-gray-700 mt-1 leading-tight text-sm`}
              >
                {format(event?.start, "MMM")}
              </div>
              <div
                className={`w-full grow h-full rounded-none z-10 relative font-bold flex flex-row items-center justify-center bg-gray-50/20 text-3xl`}
              >
                {format(event?.start, "dd")}
              </div>
            </div>

            <div
              className={`flex flex-col gap-2 p-4 items-start justify-center`}
            >
              <h1 className={`text-xl font-bold text-gray-900`}>
                {event?.title}
              </h1>
              <span
                className={`text-gray-900/30 text-sm font-wsans font-medium`}
              >
                {format(event?.start, "hh:mm a")} -{" "}
                {format(event?.end, "hh:mm a")}
              </span>
            </div>
          </div>
        </div>
        {event.pendingMembers.includes(self?._id || "") && (
          <div className={`flex flex-col gap-2 p-6 bg-white rounded-3xl`}>
            <span className={`text-gray-900/50 text-sm font-wsans`}>
              You have been invited by <b>{users[event.ownerID!]?.firstName}</b>{" "}
              to join this event.
            </span>
            <div className={`flex flex-row gap-2 w-full items-start`}>
              <button
                className={`p-3 px-6  hover:bg-rose-600 bg-black rounded-3xl text-gray-100 flex flex-row items-center gap-2`}
                onClick={async () => {
                  const res = await observe(() =>
                    fetcher(`/api/events/${event._id}/rsvp`, {
                      method: "POST",
                      body: JSON.stringify({
                        action: "deny",
                      }),
                    })
                  );
                  if (!res.ok) return;
                  if (res.status === 200) {
                    setEvent({
                      ...(await res.json()),
                    });
                  }
                }}
              >
                <XMarkIcon className={`w-4 h-4 `} />
                Decline
              </button>
              <button
                className={`p-3 bg-blue-600 rounded-3xl text-gray-100  flex flex-row items-center gap-2 grow justify-center `}
                onClick={async () => {
                  const res = await observe(() =>
                    fetcher(`/api/events/${event._id}/rsvp`, {
                      method: "POST",
                      body: JSON.stringify({
                        action: "confirm",
                      }),
                    })
                  );
                  if (!res.ok) return;
                  if (res.status === 200) {
                    setEvent({
                      ...(await res.json()),
                    });
                  }
                }}
              >
                <EnvelopeOpenIcon className={`w-4 h-4 `} />
                Accept
              </button>
            </div>
          </div>
        )}
        {event.confirmedMembers.includes(self?._id || "") && (
          <div className={`flex flex-col gap-2 p-6 bg-white rounded-3xl`}>
            <span className={`text-gray-900/50 text-sm font-wsans`}>
              You're in! You are a confirmed participant of this event.
            </span>
            <div className={`flex flex-row gap-2 w-full items-start`}>
              <button
                className={`p-3 px-6  hover:bg-rose-600 bg-black rounded-3xl text-gray-100 flex flex-row items-center gap-2 grow justify-center`}
                onClick={async () => {
                    const res = await observe(() =>
                      fetcher(`/api/events/${event._id}/rsvp`, {
                        method: "POST",
                        body: JSON.stringify({
                          action: "flake",
                        }),
                      })
                    );
                    if (!res.ok) return;
                    if (res.status === 200) {
                      setEvent({
                        ...(await res.json()),
                      });
                    }
                  }}
              >
                <ArrowLeftEndOnRectangleIcon className={`w-4 h-4 `} />
                Flake
              </button>
            </div>
          </div>
        )}
        {event.declinedMembers.includes(self?._id || "") && (
          <div className={`flex flex-col gap-2 p-6 bg-white rounded-3xl`}>
            <span className={`text-gray-900/50 text-sm font-wsans`}>
              It's alright, maybe next time! You have declined this event.
            </span>
            <div className={`flex flex-row gap-2 w-full items-start`}>
              <button
                className={`p-3 px-6  hover:bg-rose-600 bg-black rounded-3xl text-gray-100 flex flex-row items-center gap-2 grow justify-center`}
                onClick={async () => {
                  const res = await observe(() =>
                    fetcher(`/api/events/${event._id}/rsvp`, {
                      method: "POST",
                      body: JSON.stringify({
                        action: "raincheck",
                      }),
                    })
                  );
                  if (!res.ok) return;
                  if (res.status === 200) {
                    setEvent({
                      ...(await res.json()),
                    });
                  }
                }}
              >
                <ArrowLeftEndOnRectangleIcon className={`w-4 h-4 `} /> I have
                Second Thoughts
              </button>
            </div>
          </div>
        )}

        <div className={`flex flex-row gap-4 items-center justify-center`}>
          <div
            className={`flex flex-row gap-4 w-full justify-between items-center`}
          >
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              {event?.confirmedMembers.length + event?.pendingMembers.length}{" "}
              Participants 🎉
            </span>
          </div>
          <div className={`flex flex-row gap-1 w-full justify-end`}>
            <div className={`flex flex-row`}>
              {event.confirmedMembers.map((member, i) => (
                <UserProfile
                  user={users[member]!}
                  key={member}
                  className={
                    "w-8 h-8 border border-green-400 text-xs rounded-full first:ml-0 -ml-4"
                  }
                  style={{ zIndex: i }}
                />
              ))}
              {event.pendingMembers.map((member, i) => (
                <UserProfile
                  user={users[member]!}
                  key={member}
                  className={
                    "w-8 h-8 border border-yellow-400 text-xs rounded-full first:ml-0 -ml-4"
                  }
                  style={{
                    zIndex: i + event.confirmedMembers.length,
                  }}
                />
              ))}
              {event.declinedMembers.map((member, i) => (
                <UserProfile
                  user={users[member]!}
                  key={member}
                  className={
                    "w-8 h-8 border border-red-400 text-xs rounded-full first:ml-0 -ml-4"
                  }
                  style={{
                    zIndex:
                      i +
                      event.confirmedMembers.length +
                      event.pendingMembers.length,
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setViewParticipants(true)}
            className={`p-4 bg-gray-900 rounded-2xl`}
          >
            <EyeIcon className={`w-4 h-4 text-gray-100 `} />
          </button>
        </div>
      </div>
    </>
  );
};
export default EventPage;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = await getUserID(context.req);
  const eventID = context.params?.eventID as string;
  const event = await getEvent(eventID);
  if (!event) {
    return {
      notFound: true,
    };
  }
  const userReq = event.confirmedMembers.concat(
    event.pendingMembers,
    event.declinedMembers
  );
  const eventMemberSet = {} as Record<string, PublicUser | null>;
  await Promise.all(
    userReq.map(async (member) => {
      eventMemberSet[member] = await cleanUser(await getUser(member));
    })
  );
  if (userID) {
    const user = await getUser(userID);
    delete user?.password;
    return {
      props: {
        user: user,
        event: {
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        },
        users: eventMemberSet,
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
