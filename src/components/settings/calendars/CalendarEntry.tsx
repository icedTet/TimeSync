import {
  CalendarIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { CalendarReference } from "../../../utils/types/calendar";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";

export const CalendarEntry = ({
  calendar,
}: {
  calendar: CalendarReference;
}) => {
  const [calLink, setCalLink] = useState(calendar.iCalSource);
  return (
    <Link href={`/settings/calendars/${calendar._id}`}>
      <div
        key={calendar._id}
        className={`flex flex-row gap-4 items-center text-gray-700 w-full justify-between p-3 px-6 border-b last:border-none hover:bg-gray-100 transition-all`}
      >
        <div className={`flex flex-row gap-4 items-center justify-start`}>
          <div className={`relative`}>
            <CalendarIcon className={`w-8 h-8 rounded-lg`} />
            <div className={`absolute bottom-1 right-1 p-1`}>
              {calendar.type === "google" && (
                <FaGoogle className={`w-2 h-2 rounded-lg`} />
              )}
            </div>
          </div>

          <span className={`text-gray-900/80 text-sm font-wsans font-medium`}>
            {calendar.title}
          </span>
        </div>
        <ChevronRightIcon className={`w-4 h-4`} />
      </div>
    </Link>
  );
};
