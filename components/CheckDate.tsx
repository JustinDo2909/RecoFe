import { differenceInDays } from "date-fns";

export const checkDate = (date: string, dateCheck: number): boolean => {
  const targetDate = new Date(date);
  const today = new Date();

  const diff = Math.abs(differenceInDays(targetDate, today));
  return diff > dateCheck;
};
