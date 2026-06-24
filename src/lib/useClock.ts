import { useEffect, useState } from "react";

export type Clock = {
  /** Live Date object, updated every second. */
  now: Date;
  /** e.g. "14:07" */
  time: string;
  /** e.g. "14:07:42" */
  timeWithSeconds: string;
  /** e.g. "Tuesday, 23 June" */
  date: string;
  /** Time-of-day greeting. */
  greeting: string;
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function greetingFor(hour: number): string {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Ticking clock + derived greeting, shared by every layout. */
export function useClock(): Clock {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const timeWithSeconds = `${time}:${pad(now.getSeconds())}`;
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return { now, time, timeWithSeconds, date, greeting: greetingFor(now.getHours()) };
}
