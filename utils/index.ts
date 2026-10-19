import { addDays, format, subDays } from "date-fns";

export const getToday = (timeZone = "Africa/Cairo") => {
  return new Date().toLocaleDateString("en-CA", { timeZone }); // "YYYY-MM-DD"
};

export const generateDaysListBack = (days: number = 30): string[] => {
  const today = new Date();
  const lastMonthDay = subDays(today, days);

  const dateArray = Array.from({ length: days }).map((_, index) => {
    const indxDate = addDays(lastMonthDay, index + 1);
    const formatedIndexDate = format(indxDate, "yyyy-MM-dd");
    return formatedIndexDate;
  });

  return dateArray;
};
