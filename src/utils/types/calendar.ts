export type CalendarReference = {
  _id: string;
  title: string;
  iCalSource: string;
  privacy: "public" | "private";
  owner: string;
  color?: string;
  type? : "google" | "custom";
};
export type FormattedCalendarEvent = {
  _id: string;
  icalID?: string;
  title: string;
  description: string;
  ownerID?: string;
  start: Date;
  end: Date;
  type: "imported" | "custom";
  obscured?: boolean;
};
export type PlannedEvent = FormattedCalendarEvent & {
  type: "custom";
  background?: string;
  pendingMembers: string[];
  confirmedMembers: string[];
  declinedMembers: string[];
};
export type RawCalendarData = {
  PRODID: string;
  VERSION: string;
  CALSCALE: string;
  METHOD: string;
  "X-WR-CALNAME": string;
  "X-WR-TIMEZONE": string;
  "X-WR-CALDESC": string;
  VTIMEZONE: VTimezone[];
  VEVENT: VEvent[];
};

type VTimezone = {
  TZID: string;
  "X-LIC-LOCATION": string;
  STANDARD: Standard[];
};

type Standard = {
  TZOFFSETFROM: string;
  TZOFFSETTO: string;
  TZNAME: string;
  DTSTART: string;
};

type VEvent = {
  DTSTART: DateTimeValue | string;
  DTEND: DateTimeValue | string;
  RRULE?: string;
  EXDATE?: DateTimeValue;
  DTSTAMP: string;
  UID: string;
  CREATED: string;
  DESCRIPTION: string;
  "LAST-MODIFIED": string;
  LOCATION: string;
  SEQUENCE: string;
  STATUS: string;
  SUMMARY: string;
  TRANSP: string;
  ORGANIZER?: Organizer;
  ATTENDEE?: Attendee;
  VALARM?: VAlarm[];
};

type DateTimeValue = {
  key: string;
  __value__: string;
  TZID?: string;
  VALUE?: string;
};

type Organizer = {
  key: string;
  __value__: string;
  CN: string;
};

type Attendee = {
  key: string;
  __value__: string;
  CUTYPE: string;
  ROLE: string;
  PARTSTAT: string;
  CN: string;
  "X-NUM-GUESTS": string;
};

type VAlarm = {
  ACTION: string;
  TRIGGER: {
    key: string;
    __value__: string;
    VALUE: string;
  };
};