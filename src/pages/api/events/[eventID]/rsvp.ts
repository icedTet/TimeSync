import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { PlannedEvent } from "../../../../utils/types/calendar";
import {
  getEvent,
  updateEvent,
} from "../../../../utils/ServersideHelpers/eventUtils";
import { getUserID } from "../../../../utils/Clients/AuthManager";
type NotFoundResponse = null;
export type GetEventResponse = PlannedEvent | NotFoundResponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetEventResponse>
) {
  if (req.method === "POST") {
    const eventID = req.query.eventID as string;
    const action = req.body.action as string;
    if (
      action !== "flake" &&
      action !== "confirm" &&
      action !== "deny" &&
      action !== "raincheck"
    ) {
      return res.status(400).json(null);
    }
    const userID = await getUserID(req);
    if (!userID) {
      return res.status(401).json(null);
    }

    if (!ObjectId.isValid(eventID)) {
      return res.status(404).json(null);
    }
    const event = await getEvent(eventID);
    if (!event) {
      return res.status(404).json(null);
    }
    switch (action) {
      case "flake":
        if (event.confirmedMembers.includes(userID)) {
          event.confirmedMembers = event.confirmedMembers.filter(
            (id) => id !== userID
          );
          event.pendingMembers.push(userID);
          await updateEvent(event._id, {
            confirmedMembers: event.confirmedMembers,
            pendingMembers: event.pendingMembers,
          });
        }
        break;
      case "confirm":
        if (event.pendingMembers.includes(userID)) {
          event.pendingMembers = event.pendingMembers.filter(
            (id) => id !== userID
          );
          event.confirmedMembers.push(userID);
          await updateEvent(event._id, {
            confirmedMembers: event.confirmedMembers,
            pendingMembers: event.pendingMembers,
          });
        }
        break;
      case "deny":
        if (event.pendingMembers.includes(userID)) {
          event.pendingMembers = event.pendingMembers.filter(
            (id) => id !== userID
          );
          await updateEvent(event._id, {
            pendingMembers: event.pendingMembers,
            declinedMembers: [...event.declinedMembers, userID],
          });
        }
      case "raincheck":
        if (event.declinedMembers.includes(userID)) {
          event.declinedMembers = event.declinedMembers.filter(
            (id) => id !== userID
          );
          event.pendingMembers.push(userID);
          await updateEvent(event._id, {
            declinedMembers: event.declinedMembers,
            pendingMembers: event.pendingMembers,
          });
        }
        if (event.confirmedMembers.includes(userID)) {
          event.confirmedMembers = event.confirmedMembers.filter(
            (id) => id !== userID
          );
          event.pendingMembers.push(userID);
          await updateEvent(event._id, {
            confirmedMembers: event.confirmedMembers,
            pendingMembers: event.pendingMembers,
          });
        }

      default:
        break;
    }
    res.status(200).json(await getEvent(eventID));
  }
}
