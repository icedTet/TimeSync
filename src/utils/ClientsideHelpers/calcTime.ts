import {
  MinPriorityQueue,
  PriorityQueue,
} from "@datastructures-js/priority-queue";
export const getAvailableTimes = (
  intervals: [Date, Date][],
  minDuration: number,
  inRange: [Date, Date]
) => {
  let freeTimes = [] as [Date, Date][];
  let pq = new PriorityQueue<[Date, Date]>(
    (a, b) => a[0].getTime() - b[0].getTime()
  );
  intervals.forEach((interval) => pq.enqueue(interval));

  let startTime = inRange[0];

  let lastEnd = inRange[0];
  let temp = pq.dequeue();
  if (
    startTime < temp[0] &&
    Math.abs(temp[0].getTime() - startTime.getTime()) >= minDuration
  ) {
    freeTimes.push([startTime, temp[0]]);
  }
  while (!pq.isEmpty()) {
    let current = pq.dequeue();
    if (
      temp[1].getTime() < current[0].getTime() &&
      Math.abs(current[0].getTime() - temp[1].getTime()) >= minDuration
    ) {
      freeTimes.push([temp[1], current[0]]);
      temp = current;
    } else {
      temp[1] = temp[1] > current[1] ? temp[1] : current[1];
    }
  }
  if (
    temp[1] < inRange[1] &&
    Math.abs(inRange[1].getTime() - temp[1].getTime()) >= minDuration
  ) {
    freeTimes.push([temp[1], inRange[1]]);
  }

  return freeTimes;
  // schedules = {{3,20}, {-2, 0}, {0,2}, {16,17}, {19,23}, {30,40}, {27, 33}};
};
const arrayEquals = (a: any[] | null, b: any[] | null) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
class PeopleFree {
  peopleAv: number;
  available: boolean[];
  constructor(public people: number) {
    this.peopleAv = people;
    this.available = Array(people).fill(true);
  }
  takeAvail = (person: number) => {
    this.available[person] = false;
    this.peopleAv--;
  };
  someAvailable = () => this.peopleAv > 0;
  samePeopleAvailable = (people: PeopleFree | null) =>
    arrayEquals(this.available, people?.available ?? null);
  getAvailable = () =>
    this.available.map((x, i) => (x ? i : -1)).filter((x) => x !== -1);
}
export const calculateFreeTimes = (
  calendars: [Date, Date][][],
  minDuration: number,
  inRange: [Date, Date]
) => {
  // create an array x long where x is the difference in minutes between the two dates
  const timetable = Array(
    Math.floor((inRange[1].getTime() - inRange[0].getTime()) / 60000)
  ) as PeopleFree[];
  for (let i = 0; i < timetable.length; i++) {
    timetable[i] = new PeopleFree(calendars.length);
  }
  // for each calendar set each minute of an event to true
  for (let eventI = 0; eventI < calendars.length; eventI++) {
    const events = calendars[eventI];
    for (const event of events) {
      const [start, end] = event;
      console.warn(
        "Event",
        event,
        "start",
        Math.max(
          Math.floor((start.getTime() - inRange[0].getTime()) / 60000),
          0
        ),
        "end",
        Math.floor((end.getTime() - inRange[0].getTime()) / 60000)
      );
      for (
        let i = Math.max(
          Math.floor((start.getTime() - inRange[0].getTime()) / 60000),
          0
        );
        i < Math.floor((end.getTime() - inRange[0].getTime()) / 60000);
        i++
      ) {
        if (i === 1141) console.warn("Event Setting", i, eventI);
        timetable[i].takeAvail(eventI);
      }
      console.warn(
        "Event Check for calID",
        eventI,

        "Start:",
        Math.max(
          Math.floor((start.getTime() - inRange[0].getTime()) / 60000),
          0
        ),
        "Start Value:",
        timetable[
          Math.max(
            Math.floor((start.getTime() - inRange[0].getTime()) / 60000),
            0
          )
        ],
        "End:",
        Math.floor((end.getTime() - inRange[0].getTime()) / 60000) - 1,
        "End Value:",
        timetable[
          Math.floor((end.getTime() - inRange[0].getTime()) / 60000) - 1
        ],
        timetable.length
      );
    }
  }
  console.warn("Time check", timetable[60 * 16 + 1]);
  let freeTimeIntervals = [] as {
    start: Date;
    end: Date;
    free: number[];
  }[];
  let inTimeInterval = false;
  let currentFreeTime = [0, 0] as [number, number];
  let currentPeople = null as PeopleFree | null;
  let i = 0;
  for (i = 0; i < timetable.length; i++) {
    const minute = timetable[i];
    // If we are in a time interval
    if (inTimeInterval) {
      //   console.log(
      //     minute,
      //     currentPeople,
      //     new Date(inRange[0].getTime() + i * 60000)
      //   );
      // if there is someone free in this minute
      if (minute.someAvailable()) {
        // if the people in this minute are different from the people in the current time interval
        if (!minute.samePeopleAvailable(currentPeople)) {
          if (minDuration <= i - currentFreeTime[0]) {
            freeTimeIntervals.push({
              start: new Date(
                inRange[0].getTime() + currentFreeTime[0] * 60000
              ),
              end: new Date(inRange[0].getTime() + i * 60000),
              free: currentPeople?.getAvailable() ?? [],
            });
          }
          currentFreeTime[0] = i;
          currentPeople = minute;
        }
      }
      //   if nobody is free in this minute, we are no longer in a time interval and we should add the current time interval to the freeTimeIntervals
      else {
        inTimeInterval = false;
        if (minDuration <= i - currentFreeTime[0]) {
        freeTimeIntervals.push({
          start: new Date(inRange[0].getTime() + currentFreeTime[0] * 60000),
          end: new Date(inRange[0].getTime() + i * 60000),
          free: currentPeople?.getAvailable() ?? [],
        });
    }
      }
    }
    // if we are not in a time interval, and there is someone free in this minute, we begin a new time interval
    else {
      if (minute.someAvailable()) {
        inTimeInterval = true;
        currentFreeTime[0] = i;
        currentPeople = minute;
      }
    }
  }
  //   if we are in a time interval at the end of the timetable, we should add the current time interval to the freeTimeIntervals
  if (inTimeInterval && minDuration <= i - currentFreeTime[0]) {
    freeTimeIntervals.push({
      start: new Date(inRange[0].getTime() + currentFreeTime[0] * 60000),
      end: new Date(inRange[0].getTime() + i * 60000),
      free: currentPeople?.getAvailable() ?? [],
    });
  }
  return freeTimeIntervals;
};
