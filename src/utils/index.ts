import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { addDays, addMonths, addYears } from "date-fns";

dotenv.config();

export const SECRET = process.env.SECRET_KEY ?? "SECRET_KEY";

export function getToken(name: string, email: string) {
  let token = jwt.sign(
    {
      data: JSON.stringify({ name, email }),
    },
    SECRET,
    { expiresIn: "1h" }
  );
  return token;
}

export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

export function addMonthsToDate(date: Date, months: number): Date {
  return addMonths(date, months);
}

export function addYearsToDate(date: Date, years: number): Date {
  return addYears(date, years);
}
