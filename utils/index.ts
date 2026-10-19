import { addDays, format, subDays } from "date-fns";

export const getToday = (timeZone = "Africa/Cairo") => {
  return new Date().toLocaleDateString("en-CA", { timeZone }); // "YYYY-MM-DD"
};

export const genereateDaysListBack = (index: number = 30): string[] => {
  const today = new Date();
  const lastMonthDay = subDays(today, index);

  const dateArray = Array.from({ length: index }).map((_, index) => {
    const indxDate = addDays(lastMonthDay, index + 1);
    const formatedIndexDate = format(indxDate, "yyyy-MM-dd");
    return formatedIndexDate;
  });

  return dateArray;
};
