export const removeUndefinedProperties = (obj: any) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};
export const createDate = (
  month: number,
  day: number,
  hour: number,
  minute: number
) => {
  return new Date(new Date().getFullYear(), month, day, hour, minute);
};
