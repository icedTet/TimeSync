import { useEffect, useState } from "react";
import {
  MinPriorityQueue,
  PriorityQueue,
} from "@datastructures-js/priority-queue";
import {
  calculateFreeTimes,
  getAvailableTimes,
} from "../utils/ClientsideHelpers/calcTime";

export const DemoPage = () => {
  const [periods, setperiods] = useState(
    [] as {
      start: Date;
      end: Date;
      free: number[];
    }[]
  );
  useEffect(() => {
    const todayWithHourAndMinute = (hour: number, minute: number) => {
      let today = new Date();
      today.setHours(hour, minute, 0, 0);
      return today;
    };
    let start = performance.now();
    let ronitSchedule = [
      [todayWithHourAndMinute(0, 0), todayWithHourAndMinute(16, 0)],
      [todayWithHourAndMinute(18, 0), todayWithHourAndMinute(19, 0)],
      [todayWithHourAndMinute(20, 0), todayWithHourAndMinute(22, 59)],
    ] as [Date, Date][];
    let pandaSchedule = [
      [todayWithHourAndMinute(0, 0), todayWithHourAndMinute(19, 0)],
      [todayWithHourAndMinute(20, 0), todayWithHourAndMinute(22, 59)],
    ];
    let veerSchedule = [
      [todayWithHourAndMinute(0, 0), todayWithHourAndMinute(15, 30)],
      [todayWithHourAndMinute(16, 30), todayWithHourAndMinute(19, 30)],
      [todayWithHourAndMinute(20, 0), todayWithHourAndMinute(22, 59)],
    ];
    let JohnSchedule = [
        [todayWithHourAndMinute(0, 0), todayWithHourAndMinute(15, 30)],
        [todayWithHourAndMinute(16, 30), todayWithHourAndMinute(19, 30)],
        [todayWithHourAndMinute(20, 0), todayWithHourAndMinute(22, 59)],
    ]
    let schedules = [ronitSchedule, pandaSchedule, veerSchedule,JohnSchedule] as [
      Date,
      Date
    ][][];
    let minDuration = 0;
    let inRange = [
      todayWithHourAndMinute(18, 0),
      todayWithHourAndMinute(23, 59),
    ] as [Date, Date];
    console.log("Time to calculate free times", performance.now() - start);
    start = performance.now();
    // console.log(calculateFreeTimes(schedules, minDuration, inRange));
    setperiods(calculateFreeTimes(schedules, minDuration, inRange));
    console.log("Time to set state", performance.now() - start);
  }, []);
  return periods.length ? (
    <div className={`flex flex-row gap-4`}>
      {periods.map((period) => (
        <div className={`p-2 bg-red-300`}>
          <h1>{period.start.toLocaleTimeString()}</h1>
          <h1>{period.end.toLocaleTimeString()}</h1>
          {period.free.map((time) => (
            <h1>{time}</h1>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default DemoPage;
