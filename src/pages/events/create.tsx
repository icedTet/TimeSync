import { GetServerSideProps } from "next";
import { getUserID } from "../../utils/Clients/AuthManager";
import { getUser } from "../../utils/ServersideHelpers/getUser";
import {
  EventUserEntry,
  UserSearchResult,
} from "../../components/Events/Create/UserEntry";
import { GivenUser, PublicUser } from "../../utils/types/user";
import { useSelf } from "../../utils/ClientsideHelpers/useSelf";
import {
  CalendarDateRangeIcon,
  ClockIcon,
  PhotoIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Modal } from "../../components/Modal";
import { DatePicker } from "rsuite";
import { addHours, format, set, subHours } from "date-fns";
import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import { useCalendarCalculator } from "../../utils/ClientsideHelpers/useCalendarCalculator";
import { UserProfile } from "../../components/user/UserProfile";

export const CreateEvent = (props: { user: GivenUser }) => {
  const self = useSelf(props.user);
  const [search, setSearch] = useState("");
  const [searchResults, setsearchResults] = useState([] as PublicUser[]);

  const [bgFile, setBgFile] = useState(null as File | null);
  const [bgURL, setBgURL] = useState("");
  const bgInput = useRef<HTMLInputElement>(null);

  const [participants, setParticipants] = useState(
    new Map<string, PublicUser>()
  );
  useEffect(()=>{
    participants.set(self?._id || "", self as PublicUser);
    setParticipants(new Map<string, PublicUser>(
      participants
    ));
  },[self])
  const [showAvailabilityFinder, setShowAvailabilityFinder] = useState(false);
  const [targetDate, setTargetDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [targetStartTime, setTargetStartTime] = useState(
    format(subHours(new Date(), 4), "HH:mm")
  );
  const [targetEndTime, setTargetEndTime] = useState(
    format(new Date(), "HH:mm")
  );
  const [targetDuration, setTargetDuration] = useState(1);
  const [calculator, slotCount] = useCalendarCalculator(
    Array.from(participants.keys()).concat(self?._id || ""),
    targetDate,
    targetStartTime,
    targetEndTime,
    targetDuration || 1
  );
  useEffect(() => {
    if (search.length > 0) {
      fetch(`/api/users/search?query=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setsearchResults(data);
        });
    } else {
      setsearchResults([]);
    }
  }, [search]);
  useEffect(() => {
    if (bgFile) {
      setBgURL(URL.createObjectURL(bgFile));
    }
  }, [bgFile]);

  return (
    <>
      <Modal
        onClose={() => setShowAvailabilityFinder(false)}
        visible={showAvailabilityFinder}
        className={`w-[calc(100%-4rem)] px-8 py-4 flex flex-col gap-4`}
      >
        <h1 className={`text-lg font-poppins font-medium text-gray-800`}>
          Find group availability
        </h1>{" "}
        <div className={`flex flex-col gap-4`}>
          <div className={`flex flex-col gap-1 w-full`} onClick={() => {}}>
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              Target Date *
            </span>
            <div
              className={`w-full bg-gray-100 rounded-2xl flex flex-row items-center justify-evenly px-4 border border-gray-900/10 hover:shadow-lg transition-all`}
              onClick={(e) => {
                const node = e.target as HTMLDivElement;
                node.querySelector("input")?.focus();
              }}
            >
              <CalendarDaysIcon className={`w-6 h-6 text-gray-900/40`} />
              <input
                className={`basicinput !bg-gray-100 !rounded-2xl grow !border-none !outline-none`}
                placeholder="12:00 PM - 2:00 PM"
                type="date"
                onChange={(e) => {
                  setTargetDate(e.target.value);
                }}
                value={targetDate}
              />
            </div>
          </div>
          <div className={`flex flex-col gap-1 w-full`} onClick={() => {}}>
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              Find availability fron
            </span>
            <div className={`flex flex-row items-center justify-between gap-2`}>
              <div
                className={`flex w-full bg-gray-100 rounded-2xl border border-gray-900/10 hover:shadow-lg transition-all items-center justify-center`}
                onClick={(e) => {
                  const node = e.target as HTMLDivElement;
                  node.querySelector("input")?.focus();
                }}
              >
                <input
                  className={`basicinput !bg-gray-100 !rounded-2xl grow !outline-none !border-none`}
                  placeholder="12:00 PM - 2:00 PM"
                  type="time"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  value={targetStartTime}
                  onChange={(e) => {
                    setTargetStartTime(e.target.value);
                  }}
                />
              </div>
              <span className={`text-gray-900/40 text-sm font-wsans`}>to</span>
              <div
                className={`flex w-full bg-gray-100 rounded-2xl border border-gray-900/10 hover:shadow-lg transition-all items-center justify-center`}
                onClick={(e) => {
                  const node = e.target as HTMLDivElement;
                  node.querySelector("input")?.focus();
                }}
              >
                <input
                  className={`basicinput !bg-gray-100 !rounded-2xl grow !outline-none !border-none text-center`}
                  placeholder="12:00 PM - 2:00 PM"
                  type="time"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  value={targetEndTime}
                  onChange={(e) => {
                    setTargetEndTime(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className={`flex flex-col gap-1 w-full`} onClick={() => {}}>
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              Event Duration
            </span>
            <div
              className={`w-full bg-gray-100 rounded-2xl flex flex-row items-center justify-evenly px-4 border border-gray-900/10 hover:shadow-lg transition-all`}
              onClick={(e) => {
                const node = e.target as HTMLDivElement;
                node.querySelector("input")?.focus();
              }}
            >
              <ClockIcon className={`w-6 h-6 text-gray-900/40`} />
              <input
                className={`basicinput !bg-gray-100 !rounded-2xl grow !border-none !outline-none`}
                placeholder=""
                type="number"
                onChange={(e) => {
                  setTargetDuration(parseInt(e.target.value));
                }}
                value={targetDuration}
              />
              <span className={`text-gray-900/40 text-sm font-wsans`}>
                hours
              </span>
            </div>
          </div>
          <button
            className={`bg-black rounded-2xl p-2.5 text-white font-medium mt-4`}
          >
            Show Availability ({slotCount} options)
          </button>
          {/* {JSON.stringify(slotCount)}
           */}
          {calculator.freeTimes?.map((slot) => (
            <div className={`flex flex-row gap-4 items-center`} key={JSON.stringify(slot)}>
              <span className={`text-gray-900/40 text-sm font-wsans`}>
                {format(slot.start, "hh:mm a")} - {format(slot.end, "hh:mm a")}
              </span>
              <div className={`flex flex-row gap-4`}>
                {Array.from(new Set(slot.peopleFree)).map((user) => (
                  <UserProfile user={participants.get(user)} className={`h-8 w-8 rounded-full text-sm`} key={user} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
      {bgFile && (
        <div className={`w-full h-full fixed top-0 left-0`}>
          <div
            className={`w-full h-full relative top-0 left-0 overflow-hidden`}
          >
            <div
              className={`w-[120%] h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cover blur-lg transition-all duration-300`}
              style={{
                backgroundImage: `url(${bgURL})`,
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
        <h1 className={`text-xl font-poppins font-normal text-gray-500`}>
          Create a new event
        </h1>{" "}
        <div className={`flex flex-col gap-4`}>
          <div className={`flex flex-col gap-2 w-full`} onClick={() => {}}>
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              Event Name *
            </span>
            <input
              className={`basicinput !bg-gray-100 !rounded-2xl`}
              placeholder="A New Event"
            />
          </div>
        </div>
        <div className={`flex flex-col gap-4`}>
          <div className={`flex flex-col gap-2 w-full`} onClick={() => {}}>
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              Event Image
            </span>
            <input
              type="file"
              onChange={(e) => {
                setBgFile(e.target.files?.[0]!);
                e.target.files = null;
              }}
              className={`hidden`}
              ref={bgInput}
              accept="image/png, image/jpeg, image/jpg, image/gif"
            />
            <div className={`flex flex-row gap-4 z-0 relative items-center`}>
              <div
                className={`w-12 h-12 rounded-2xl shrink-0 grow-0 border border-gray-900/30 flex flex-row items-center justify-center`}
                style={{
                  backgroundImage: `url(${bgURL})`,
                  backgroundSize: `cover`,
                  backgroundPosition: `center`,
                }}
              >
                {!bgURL && <PhotoIcon className={`w-6 h-6 text-gray-900/30`} />}
              </div>
              <button
                className={`bg-black rounded-2xl p-2.5 text-white font-medium flex flex-row gap-4 w-full items-center justify-center`}
                onClick={() => bgInput.current?.click()}
              >
                <CloudArrowUpIcon className={`w-6 h-6 text-white`} />
                Upload Event Image
              </button>
            </div>
          </div>
        </div>
        <div className={`flex flex-col gap-2`}>
          <div
            className={`flex flex-row gap-4 w-full justify-between items-center`}
            onClick={() => {}}
          >
            <span className={`text-gray-900/40 text-sm font-wsans`}>
              Event Participants ({participants.size + 1}) 📬 *
            </span>
          </div>
          <div className={`flex flex-row gap-4 z-0 relative items-center`}>
            <input
              className={`basicinput !bg-gray-100 !rounded-2xl`}
              placeholder="Add a participant"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <button
            className={`bg-black rounded-2xl p-2.5 text-white font-medium`}
          >
            <PlusIcon className={`w-6 h-6 text-white`} />
          </button> */}
          </div>
          <div
            className={`flex flex-col gap-0 z-0 relative bg-gray-100/50 rounded-2xl border border-gray-900/5 items-center`}
          >
            {!!search.length &&
              searchResults.map((user) => (
                <UserSearchResult
                  user={user}
                  key={`${user._id}-search`}
                  addUser={() => {
                    let users = new Map(participants);
                    users.set(user._id, user);
                    setParticipants(users);
                    setSearch("");
                  }}
                  className={
                    participants.has(user._id)
                      ? "opacity-40 cursor-not-allowed pointer-events-none"
                      : ""
                  }
                />
              ))}
          </div>
          <div
            className={`flex flex-col gap-0 z-0 relative bg-gray-50 rounded-2xl border border-gray-900/5 items-center`}
          >
            {Array.from(participants.values()).map((user) => (
              <EventUserEntry
                user={user}
                owner={user._id === self?._id}
                key={`${user._id}-entry`}
                onDelete={() => {
                  participants.delete(user._id);
                  setParticipants(new Map(participants));
                }}
              />
            ))}
          </div>
        </div>
        <div className={`flex flex-col gap-2`}>
          <span className={`text-gray-900/40 text-sm font-wsans`}>
            Event Time
          </span>
          <button
            className={`bg-black rounded-2xl p-2.5 text-white font-medium flex flex-row gap-4 items-center justify-center`}
            onClick={() => setShowAvailabilityFinder(true)}
          >
            <CalendarDateRangeIcon className={`w-6 h-6 text-white`} />
            Find group availability
          </button>
        </div>
      </div>
    </>
  );
};
export default CreateEvent;
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
