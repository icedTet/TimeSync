//@ts-expect-error
import IcalExpander from "ical-expander";
import {
  addDays,
  addMilliseconds,
  addSeconds,
  endOfDay,
  format as df,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
  subDays,
  subMilliseconds,
  subSeconds,
} from "date-fns";
import * as dateFnsTz from "date-fns-tz";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const isICalValid = async (icalData: string) => {
  try {
    const icalExpander = new IcalExpander({ ics: icalData });
    const events = icalExpander.between(
      subDays(new Date(), 30),
      addDays(new Date(), 365)
    );
    const parsedEvents = await parseCal(icalData, [
      subDays(new Date(), 30),
      addDays(new Date(), 365),
    ]);
    return !!parsedEvents.length;
  } catch (e) {
    return false;
  }
};

// const

const findAttr = (key: string, arr: any[][]) => {
  // console.log({l:arr[1]});
  return arr?.[1].find((item) => item[0] === key)?.[3];
};

export const parseCal = async (iCalData: string, interval: [Date, Date]) => {
  const icalExpander = new IcalExpander({ ics: iCalData, maxIterations: 1000 });
  const events = icalExpander.between(interval[0], interval[1]);
  const calEvents = [] as any[];
  events.occurrences.map((event: any) => {
    const rawStart = event.startDate;
    let start = `${rawStart.year}-${`${rawStart.month}`.padStart(
      2,
      "0"
    )}-${`${rawStart.day}`.padStart(2, "0")}T${`${rawStart.hour}`.padStart(
      2,
      "0"
    )}:${`${rawStart.minute}`.padStart(2, "0")}:${`${rawStart.second}`.padStart(
      2,
      "0"
    )}Z`;
    const rawEnd = event.endDate;
    const end = `${rawEnd.year}-${`${rawEnd.month}`.padStart(
      2,
      "0"
    )}-${`${rawEnd.day}`.padStart(2, "0")}T${`${rawEnd.hour}`.padStart(
      2,
      "0"
    )}:${`${rawEnd.minute}`.padStart(2, "0")}:${`${rawEnd.second}`.padStart(
      2,
      "0"
    )}Z`;
    calEvents.push({
      id: `${findAttr("uid", event.item.component?.jCal)}-${toZonedTime(
        new Date(start),
        Intl.DateTimeFormat().resolvedOptions().timeZone
      )}-${toZonedTime(
        new Date(end),
        Intl.DateTimeFormat().resolvedOptions().timeZone
      )}
        `,
      title: findAttr("summary", event.item.component?.jCal),
      startDate: toZonedTime(
        new Date(start),
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
      endDate: toZonedTime(
        new Date(end),
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
      location: findAttr("location", event.component?.jCal),
      type: "recurrence",
    });
  });
  events.events.map((event: any) => {
    let startISO = findAttr("dtstart", event.component.jCal);
    if (!startISO.match(/T$/)) {
      startISO = startISO + "T00:00:00";
    }
    if (JSON.stringify(event).includes("Bible")) {
      console.log({
        startISO,
        event,
        sum: findAttr("summary", event.component.jCal),
        correctedTime: toZonedTime(
          new Date(startISO),
          Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
        cor2Time: fromZonedTime(
          toZonedTime(
            new Date(startISO),
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
          Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
        default: new Date(startISO),
      });
    }
    let start = toZonedTime(
      new Date(startISO),
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    let endISO = findAttr("dtend", event.component.jCal);
    if (!endISO) {
      endISO = findAttr("dtstart", event.component.jCal);
    }
    if (!endISO.match(/T$/)) {
      endISO = endISO + "T00:00:00";
    }
    let end = subMilliseconds(
      toZonedTime(
        new Date(endISO),
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
      1
    );
    calEvents.push({
      id: findAttr("uid", event.component.jCal),
      title: findAttr("summary", event.component.jCal),
      location: findAttr("location", event.component.jCal),
      startDate: start,
      endDate: end,
      type: "event",
    });
  });
  return calEvents as {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    location: string;
    type: "recurrence" | "event";
  }[];
};
