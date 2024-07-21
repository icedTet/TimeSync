import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {  PlannedEvent } from "../../../utils/types/calendar";
import { getEvent, getEventsByMember } from "../../../utils/ServersideHelpers/eventUtils";
import { getUserID } from "../../../utils/Clients/AuthManager";
type NotFoundResponse = null;
export type GetEventResponse = PlannedEvent[] | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetEventResponse>
) {
  if (req.method === "GET") {
    const userID = await getUserID(req);
    if (!userID) {
      return res.status(401).json(null);
    }
    const events = (await getEventsByMember(userID)).filter((x) => x.pendingMembers.includes(userID));
    if (!events) {
      return res.status(404).json(null);
    }
    return res.status(200).json(events);
  }
}
