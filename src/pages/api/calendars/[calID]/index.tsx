import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../../utils/Clients/AuthManager";
import Mongo from "../../../../utils/Clients/Mongo";
import {
  getUser,
  updateUser,
} from "../../../../utils/ServersideHelpers/getUser";
import { GivenUser, User } from "../../../../utils/types/user";
import { CalendarReference } from "../../../../utils/types/calendar";
import {
  getCalendar,
  updateCalendar,
} from "../../../../utils/ServersideHelpers/calUtils";
type NotFoundResponse = null;
export type SelfUserResponse = CalendarReference | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelfUserResponse>
) {
  if (req.method === "POST") {
    const userID = await getUserID(req);
    if (!userID) {
      return res.status(401).json(null);
    }
    const calID = req.query.calID as string;
    if (!calID || !ObjectId.isValid(calID)) {
      return res.status(404).json(null);
    }
    let cal = await getCalendar(calID);
    if (!cal) {
      return res.status(404).json(null);
    }
    if (!(await updateCalendar(calID, req.body))) {
      return res.status(500).json(null);
    }
    cal = await getCalendar(calID);
    return res.status(200).json(cal);
  }
}
