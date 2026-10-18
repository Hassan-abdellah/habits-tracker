export const getToday = (timeZone = "Africa/Cairo") => {
  return new Date().toLocaleDateString("en-CA", { timeZone }); // "YYYY-MM-DD"
};
