import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { getUser } from "../../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../../utils/types/user";
import { CalendarReference } from "../../../utils/types/calendar";
import { isICalValid } from "../../../utils/ServersideHelpers/ICalUtils";
import Mongo from "../../../utils/Clients/Mongo";
import { ObjectId } from "mongodb";
import {
  createCalendar,
  getCalendar,
} from "../../../utils/ServersideHelpers/calUtils";

type ErrorReponse = { error: string };
type SuccessResponse = CalendarReference;

export type CreateCalendarResponse = SuccessResponse | ErrorReponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCalendarResponse>
) {
  if (req.method === "POST") {
    const userID = await getUserID(req);
    if (!userID) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await getUser(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!req.body.title) res.status(400).json({ error: "Missing title" });
    if (!req.body.icalLink)
      res.status(400).json({ error: "Missing iCal Link" });
    if (!req.body.privacy) res.status(400).json({ error: "Missing privacy" });
    if (!(req.body.privacy === "public") && !(req.body.privacy === "private"))
      res.status(400).json({ error: "Invalid privacy" });
    // pull the ical link from the request body
    const { title, icalLink, privacy } = req.body;
    // check if iCal is valid & parsable
    const icalData = await fetch(icalLink)
      .then((res) => res.text())
      .catch((e) => {
        console.error(e);
        return null;
      });
    if (!icalData) {
      return res.status(400).json({ error: "Failed to fetch iCal" });
    }
    const validICal = await isICalValid(icalData);
    if (!validICal) {
      return res.status(400).json({ error: "Invalid iCal Link" });
    }
    // create the calendar
    let insert = await createCalendar(title, icalLink, privacy, user._id.toString());
    if (!insert) {
      return res.status(500).json({ error: "Failed to create calendar" });
    }

    const cal = await getCalendar(insert.toString());

    if (!cal) {
      return res.status(500).json({ error: "Failed to fetch calendar" });
    }
    return res.status(200).json(cal);
  }
}
