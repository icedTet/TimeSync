import { NextApiRequest, NextApiResponse } from "next";
import { getUserID } from "../../../utils/Clients/AuthManager";
import { getUser } from "../../../utils/ServersideHelpers/getUser";
import { GivenUser } from "../../../utils/types/user";
import { CalendarReference } from "../../../utils/types/calendar";
import { parseCal } from "../../../utils/ServersideHelpers/ICalUtils";
import { addDays, subDays } from "date-fns";

type ErrorReponse = { error: string };
type SuccessResponse = {
  cal: {
    description: string;
    start: Date;
    end: Date;
    icalID: string;
    obscured: boolean;
    title: string;
    type: string;
  }[];
  start: Date;
  end: Date;
};

export type CreateCalendarResponse = SuccessResponse | ErrorReponse;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCalendarResponse>
) {
  // get ical link
  const link = req.body.url as string;
  const data = await fetch(link).then((res) => res.text());
  let center = new Date();
  center.setDate(1);
  center.setMonth(3);
  center.setFullYear(2024);
  const cal = await (
    await parseCal(data, [subDays(center, 7), addDays(center, 7)])
  ).map((rawEvent) => ({
    description: `Automatically imported from Thing`,

    start: rawEvent.startDate,
    end: rawEvent.endDate,

    icalID: rawEvent.id,

    obscured: false,
    title: rawEvent.title,
    type: "imported",
  }));
  console.log(cal);
  res
    .status(200)
    .json({ cal, start: subDays(center, 7), end: addDays(center, 7) });
}
