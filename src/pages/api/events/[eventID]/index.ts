import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { PlannedEvent } from "../../../../utils/types/calendar";
import { getEvent } from "../../../../utils/ServersideHelpers/eventUtils";
type NotFoundResponse = null;
export type GetEventResponse = PlannedEvent | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetEventResponse>
) {
  if (req.method === "GET") {
    const eventID = req.query.eventID as string;
    if (!ObjectId.isValid(eventID)) {
      return res.status(404).json(null);
    }
    console.log(eventID);
    if (!eventID) {
      return res.status(401).json(null);
    }
    const event = await getEvent(eventID);
    if (!event) {
      return res.status(404).json(null);
    }
    return res.status(200).json(event);
  }
}
