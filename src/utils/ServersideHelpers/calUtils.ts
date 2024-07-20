import { ObjectId } from "mongodb";
import Mongo from "../Clients/Mongo";
import { CalendarReference } from "../types/calendar";
import { removeUndefinedProperties } from "./MiniLib";

export const getCalendar = async (_id?: string | null) => {
  if (!_id || !ObjectId.isValid(_id)) {
    console.log("Invalid ID");
    return null;
  }
  const calendar = await (
    await Mongo
  )
    .db("Calendars")
    .collection("calendars")
    .findOne({ _id: new ObjectId(_id) })
    .then(
      (cal) =>
        cal &&
        ({
          ...cal,
          _id: cal._id.toString(),
        } as CalendarReference)
    );

  return calendar;
};

export const getCalendars = async (userID: string) => {
  if (!ObjectId.isValid(userID)) {
    return [];
  }
  const calendars = await (
    await Mongo
  )
    .db("Calendars")
    .collection("calendars")
    .find({ owner: userID })
    .toArray()
    .then((cals) => cals.map((cal) => ({ ...cal, _id: cal._id.toString() }))) as CalendarReference[];

  return calendars;
};

export const updateRawCalendar = async (
  _id: string,
  update: Partial<CalendarReference>
) => {
  if (!ObjectId.isValid(_id)) {
    return false;
  }

  const updated = await (
    await Mongo
  )
    .db("Calendars")
    .collection("calendars")
    .updateOne({ _id: new ObjectId(_id) }, { $set: update });

  return updated.acknowledged;
};

export const updateCalendar = async (
  _id: string,
  update: Partial<CalendarReference>
) => {
  return updateRawCalendar(
    _id,
    removeUndefinedProperties({
      title: update.title,
      iCalSource: update.iCalSource,
      privacy: update.privacy,
      color: update.color,
    }) as Partial<CalendarReference>
  );
};

export const createCalendar = async (
  title: string,
  iCalSource: string,
  privacy: "public" | "private",
  owner: string
) => {
  const _id = new ObjectId();
  const newCalendar: Partial<CalendarReference> = {
    title,
    iCalSource,
    privacy,
    owner,
  };
  let insert = await (
    await Mongo
  )
    .db("Calendars")
    .collection("calendars")
    .insertOne({
      ...newCalendar,
      _id,
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  if (!insert || !insert.acknowledged) {
    return null;
  }

  return _id.toString();
};
