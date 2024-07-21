import { useEffect, useRef, useState } from "react";
import { CalendarReference, FormattedCalendarEvent } from "../types/calendar";
import { calculateFreeTimes } from "./calcTime";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
type CachedCalendarData = {
  userID: string;
  events: FormattedCalendarEvent[];
  lastSynced: Date;
};
export const useCalendarCalculator = (
  users: string[],
  date: string,
  startTime: string,
  endTime: string,
  // start: Date,
  // end: Date,
  minDuration: number
) => {
  // guess user's timezone
  // alert(new Date().toISOString())
  // alert(new Date(`${date}T${startTime}`))
  const start = fromZonedTime(
    new Date(`${date}T${startTime}`),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const end = fromZonedTime(
    new Date(`${date}T${endTime}`),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const cachedCalendarData = useRef<Map<string, CachedCalendarData>>(new Map());
  const [results, setResults] = useState({
    users: [] as string[],
    freeTimes: [] as {
      peopleFree: string[];
      start: Date;
      end: Date;
    }[],
  });
  const [slotCount, setSlotCount] = useState(0);
  useEffect(() => {
    (async () => {
      const fetchTargets = users.filter(
        (x) =>
          !cachedCalendarData.current.has(x) ||
          cachedCalendarData.current.get(x)!.lastSynced <
            new Date(Date.now() - 1000 * 60 * 5)
      );
      const results = (await Promise.all(
        fetchTargets.map(async (userID) => {
          const res = await fetch(
            `/api/calendars/getUserAvailability?userID=${userID}`
          );
          if (res.status === 404) {
            return null;
          }
          return res.json();
        })
      )) as { events: FormattedCalendarEvent[]; calRef: CalendarReference }[][];
      console.log("Fetching", results);
      results.forEach((userCals, i) => {
        const result = userCals
          .map((x) =>
            x.events.map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            }))
          )
          .flat();
        if (!result) return;
        const userID = fetchTargets[i];
        console.log(userID, { result });
        cachedCalendarData.current.set(userID, {
          userID,
          events: result as FormattedCalendarEvent[],
          lastSynced: new Date(),
        });
      });
      //   Pull all the events within the range for each user
      const eventLists = users
        .map((userID) => {
          console.log({ userID, currData: cachedCalendarData.current });
          const data = cachedCalendarData.current.get(userID);
          console.log({ data });
          if (!data || !data.events)
            return {
              userID,
              events: [] as FormattedCalendarEvent[],
            };
          return {
            userID,
            events: data.events
              .filter((x) => {
                return x;
              })
              .map((event) => [event.start, event.end]),
          };
        })
        .filter((x) => x as { userID: string; events: [Date, Date][] });
      const calendars = eventLists.map((x) => x?.events) as [Date, Date][][];
      console.log(calendars, start, end);
      console.warn("Calculating Free Times", calendars, minDuration, [
        start,
        end,
      ]);
      const freeTimes = await calculateFreeTimes(calendars, minDuration, [
        start,
        end,
      ]);
      const formattedFreeTimes = freeTimes.map((freePeriod, i) => {
        console.log(freePeriod, {
          eList: eventLists,
          i: i,
          eListI: eventLists[i],
        });
        return {
          peopleFree: freePeriod.free
            .map((calID) => eventLists[calID]?.userID)
            .filter((x) => x) as string[],
          start: freePeriod.start,
          end: freePeriod.end,
        };
      });
      setResults({
        users,
        freeTimes: formattedFreeTimes,
      });
      let slots = 0;
      for (let i = 0; i < formattedFreeTimes.length; i++) {
        const freePeriod = formattedFreeTimes[i];
        let start = freePeriod.start;
        let end = freePeriod.end;
        let duration = end.getTime() - start.getTime();
        let slotCount = Math.floor(duration / (minDuration * 60 * 1000 * 60));
        slots += slotCount;
      }
      setSlotCount(slots);
    })();
  }, [JSON.stringify(users), date, startTime, endTime, minDuration]);

  return [results, slotCount] as const;
};
