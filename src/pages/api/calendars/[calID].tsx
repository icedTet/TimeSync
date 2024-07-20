import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { CalendarReference } from "../../../utils/types/calendar";
import { getCalendar } from "../../../utils/ServersideHelpers/calUtils";
type NotFoundResponse = null;
export type getCalendarResponse = CalendarReference | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getCalendarResponse>
) {
  if (req.method === "GET") {
    const calID = req.query.calID as string;
    if (!ObjectId.isValid(calID)) {
      return res.status(404).json(null);
    }
    console.log(calID);
    if (!calID) {
      return res.status(401).json(null);
    }
    const cal = await getCalendar(calID);
    if (!cal) {
      return res.status(404).json(null);
    }
    return res.status(200).json(cal);
  }
}
