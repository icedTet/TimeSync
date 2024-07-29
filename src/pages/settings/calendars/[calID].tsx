import { GetServerSideProps } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { getUser } from "../../../utils/ServersideHelpers/getUser";
import { getCalendar } from "../../../utils/ServersideHelpers/calUtils";
import {
  CalendarReference,
  RawCalendarData,
} from "../../../utils/types/calendar";
import { GivenUser } from "../../../utils/types/user";
import {
  CalendarIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "../../../components/TextInput";
import ListParent from "../../../components/settings/ListParent";
import { ListEntry } from "../../../components/settings/ListComponent/ListEntry";
import { ListEntryNameValue } from "../../../components/settings/ListComponent/ListEntryNameValue";
import { lines2tree } from "icalts";
export const CalendarEditPage = (props: {
  user: GivenUser;
  cal: CalendarReference;
}) => {
  const { user, cal } = props;
  const [calName, setCalName] = useState(cal.title);
  const [calLink, setCalLink] = useState(cal.iCalSource);
  const [parsedCal, setParsedCal] = useState<RawCalendarData | null>(null);
  const [invalidICal, setInvalidICal] = useState(false);
  useEffect(() => {
    (async () => {
      const calData = await fetch(`https://corsproxy.io/?${calLink}`).then(
        (res) => res.text()
      );
      const parsed = lines2tree(
        calData.split("\n").map((l) => l.replace(/\r/g, ""))
      ) as any;
      const vcal = parsed.VCALENDAR?.[0] as RawCalendarData;
      if (!vcal) {
        setInvalidICal(true);
        setParsedCal(null);
        return;
      }
      setInvalidICal(false);
      console.log(vcal,parsed);
      setParsedCal(vcal);
    })();
  }, [calLink]);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={`w-full grow flex flex-col gap-8 p-8 pt-16`}>
      <div className={`flex flex-col gap-4`}>
        <TextInput
          label="Calendar Name"
          value={calName}
          onChange={(e) => setCalName(e.target.value)}
          placeholder="Calendar Name"
          id="calName"
          name="calName"
          autoComplete="off"
          type={""}
          required
          subLabel="This is the name of your calendar. If this is a public calendar, it will
        be displayed in the app for your friends to see."
        />
        <TextInput
          label="Calendar Link"
          value={calLink}
          onChange={(e) => setCalLink(e.target.value)}
          placeholder="Calendar Link"
          id="calLink"
          name="calLink"
          autoComplete="off"
          type={""}
          required
          subLabel="This is the link to your calendar. This is how we will be able to automatically update your calendar."
        />
        <span className={`text-gray-900/60 text-md font-medium font-poppins`}>
          Calendar Information
        </span>
        {invalidICal ? (
          <>
            <ListParent>
              <ListEntryNameValue name="Invalid ICal">
                This is not a valid ICal file.
              </ListEntryNameValue>
            </ListParent>
            <span
              className={`text-red-400/80 text-xs font-wsans font-medium w-full`}
            >
              The ICal file you provided is not a valid ICal link, please
              provide a valid ICal link, or see the{" "}
              <a
                href="https://icalendar.org/"
                target="_blank"
                className={`text-blue-500`}
              >
                ICal Documentation
              </a>{" "}
              for more information.
            </span>
          </>
        ) : (
          <ListParent>
            <ListEntryNameValue name="Calendar Name">
              {parsedCal?.["X-WR-CALNAME"] || "Unknown"}
            </ListEntryNameValue>
            <ListEntryNameValue name="Calendar Description">
              {parsedCal?.["X-WR-CALDESC"] || "No Description"}
            </ListEntryNameValue>
            <ListEntryNameValue name="Calendar Timezone">
              {parsedCal?.["X-WR-TIMEZONE"] || "Unknown"}
            </ListEntryNameValue>
            <ListEntryNameValue name="ICal Version">
              {parsedCal?.["VERSION"] || "Unknown"}
            </ListEntryNameValue>
            <ListEntryNameValue name="Calendar Source">
              {parsedCal?.PRODID.split("//")[2] || "Unknown"}
            </ListEntryNameValue>
          </ListParent>
        )}
      </div>
    </div>
  );
};
export default CalendarEditPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = await getUserID(context.req);
  const user = userID && (await getUser(userID));
  if (user) {
    delete user?.password;
  } else {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  const calID = context.params?.calID as string;
  const cal = await getCalendar(calID);
  //   Check if owner == user
  if (cal?.owner !== userID) {
    return {
      redirect: {
        destination: "/settings/calendars?error=notOwner",
        permanent: false,
      },
    };
  }
  if (!cal) {
    return {
      redirect: {
        destination: "/settings/calendars?error=notFound",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: user,
      cal: cal,
    },
  };
};
