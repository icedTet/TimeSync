import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { CalendarReference } from "../../../utils/types/calendar";
import { getCalendar, getCalendars } from "../../../utils/ServersideHelpers/calUtils";
import { getUserID } from "../../../utils/Clients/AuthManager";
type NotFoundResponse = null;
export type getUserCalendarsResponse = CalendarReference[] | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getUserCalendarsResponse>
) {
  if (req.method === "GET") {
    const userID = req.query.userID as string;
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
    return res.status(200).json(cals);
  }
}
