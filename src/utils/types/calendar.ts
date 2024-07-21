export type CalendarReference = {
  _id: string;
  title: string;
  iCalSource: string;
  privacy: "public" | "private";
  owner: string;
  color?: string;
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
