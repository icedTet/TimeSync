import { ObjectId } from "mongodb";
import Mongo from "../Clients/Mongo";
import { PlannedEvent } from "../types/calendar";

export const createEvent = async (event: Partial<PlannedEvent>) => {
  event.confirmedMembers = event.confirmedMembers || [];
  event.pendingMembers = event.pendingMembers || [];
  event.declinedMembers = event.declinedMembers || [];
  event.type = "custom";

  const newID = new ObjectId();
  const created = await (
    await Mongo
  )
    .db("Calendars")
    .collection("events")
    .insertOne({
      ...event,
      _id: newID,
    });
  if (!created.acknowledged) {
    return null;
  }

  return created.insertedId.toString();
};

export const getEvent = async (id: string) => {
  return (await Mongo)
    .db("Calendars")
    .collection("events")
    .findOne({ _id: new ObjectId(id) })
    .then(
      (event) =>
        event &&
        ({
          ...event,
          _id: event._id.toString(),
        } as PlannedEvent)
    );
};
export const getEvents = async (ids: string[]) => {
  return (await Mongo)
    .db("Calendars")
    .collection("events")
    .find({ _id: { $in: ids.map((x) => new ObjectId(x)) } })
    .toArray();
};
export const updateEvent = async (id: string, event: Partial<PlannedEvent>) => {
  return (await Mongo)
    .db("Calendars")
    .collection("events")
    .updateOne({ _id: new ObjectId(id) }, { $set: event });
};
export const deleteEvent = async (id: string) => {
  return (await Mongo)
    .db("Calendars")
    .collection("events")
    .deleteOne({ _id: new ObjectId(id) });
};
export const getEventsByOwner = async (owner: string) => {
  return (await Mongo)
    .db("Calendars")
    .collection("events")
    .find({ owner })
    .toArray();
};
export const getEventsByMember = async (member: string) => {
  return (await Mongo)
    .db("Calendars")
    .collection("events")
    .find({
      $or: [
        { confirmedMembers: member },
        { pendingMembers: member },
        { declinedMembers: member },
      ],
    })
    .toArray()
    .then((events) =>
      events.map(
        (event) =>
          ({
            ...event,
            _id: event._id.toString(),
          } as PlannedEvent)
      )
    );
};
