export type CalendarReference = {
    _id: string;
    title: string;
    iCalSource: string;
    privacy: "public" | "private";
    owner: string;
    color?: string;
}
export type FormattedCalendarEvent = {
    _id: string;
    icalID: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    type: 'imported' | 'custom';
    obscured?: boolean;
}