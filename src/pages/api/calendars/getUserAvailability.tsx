import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {
  CalendarReference,
  FormattedCalendarEvent,
} from "../../../utils/types/calendar";
import {
  getCalendar,
  getCalendars,
} from "../../../utils/ServersideHelpers/calUtils";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { parseCal } from "../../../utils/ServersideHelpers/ICalUtils";
import { hash } from "crypto";
type NotFoundResponse = null;
export type getUserCalendarsResponse =
  | {
      events: FormattedCalendarEvent[];
      calRef: CalendarReference;
    }[]
  | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getUserCalendarsResponse>
) {
  if (req.method === "GET") {
    const userID = req.query.userID as string;
    let start = ~~req.query?.start!;
    let end = ~~req.query?.end!;
    if (!start) {
      start = Date.now() - 1000 * 60 * 60 * 24 * 100;
    }
    if (!end) {
      end = Date.now() + 1000 * 60 * 60 * 24 * 100;
    }
    if (!ObjectId.isValid(userID)) {
      return res.status(404).json(null);
    }
    console.log(userID);
    const currentUserID = getUserID(req);
    if (!currentUserID) {
      return res.status(401).json(null);
    }
    // Preform access check: TODO

    let cals = await getCalendars(userID);
    if (!cals) {
      return res.status(404).json(null);
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    const calEvents = await Promise.all(
      cals.map(async (calRef) => {
        let icalData = await fetch(calRef.iCalSource)
          .then((res) => res.text())
          .catch((e) => {
            console.error(e);
            return null;
          });
        if (!icalData) {
          return null;
        }
        const events = (await parseCal(icalData, [startDate, endDate])).map(
          (rawEvent) =>
            ({
              description: `Automatically imported from ${calRef.title}`,

              start: rawEvent.startDate,
              end: rawEvent.endDate,

              icalID:
                calRef.privacy === "private"
                  ? hash("sha256", rawEvent.id).toString()
                  : rawEvent.id,

              obscured: calRef.privacy === "private",
              title: calRef.privacy === "private" ? "Unknown" : rawEvent.title,
              type: "imported",
            } as FormattedCalendarEvent)
        );
        return {
          events,
          calRef,
        };
      })
    );
    const calList = calEvents.filter((cal) => cal !== null) as {
      events: FormattedCalendarEvent[];
      calRef: CalendarReference;
    }[];
    return res.status(200).json(calList);
  }
}
