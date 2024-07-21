import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { getUser } from "../../../utils/ServersideHelpers/getUser";
import { CalendarReference, PlannedEvent } from "../../../utils/types/calendar";
import { createEvent, getEvent } from "../../../utils/ServersideHelpers/eventUtils";
import { User } from "../../../utils/types/user";

type ErrorReponse = { error: string };
type SuccessResponse = PlannedEvent;

export type CreateEventResponse = SuccessResponse | ErrorReponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateEventResponse>
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
    if (!req.body.start) res.status(400).json({ error: "Missing start" });
    if (!req.body.end) res.status(400).json({ error: "Missing end" });
    if (req.body.members && !Array.isArray(req.body.members)) {
      return res.status(400).json({ error: "Invalid members" });
    }
    // find all members
    const members: User[] = [];
    if (req.body.members) {
      for (const member of req.body.members) {
        const user = await getUser(member);
        if (!user) {
          return res.status(400).json({ error: "Invalid member" });
        }
        members.push(user);
      }
    }
    // parse start and end dates
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid start date" });
    }
    if (isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid end date" });
    }
    if (start > end) {
      return res.status(400).json({ error: "Start date after end date" });
    }
    const event: Partial<PlannedEvent> = {
      title: req.body.title,
      background: req.body.background,
      description: req.body.description,
      start,
      end,
      type: "custom",
      pendingMembers: members.map((member) => member._id.toString()),
      confirmedMembers: [],
      declinedMembers: [],
      ownerID: user._id.toString(),
    };
    // create event
    const newID = await createEvent(event);
    if (!newID) {
      return res.status(500).json({ error: "Failed to create event" });
    }
    const cloudEvent = await getEvent(newID);
    if (!cloudEvent) {
      return res.status(500).json({ error: "Failed to get event" });
    }
    return res.status(200).json(cloudEvent);
  }
}
