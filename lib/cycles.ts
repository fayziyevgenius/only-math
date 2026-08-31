// lib/cycles.ts

export type CycleKey = "genesis" | "independence";

export type Cycle = {
  key: CycleKey;
  name: string;
  start: string;
  end: string;
};

export const CYCLES: Cycle[] = [
  {
    key: "genesis",
    name: "Genesis Cycle",
    start: "2026-08-03",
    end: "2026-08-16",
  },
  {
    key: "independence",
    name: "Independence Cycle",
    start: "2026-08-17",
    end: "2026-08-30",
  },
];

export function getTashkentDate(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function getCurrentCycle(): Cycle | null {
  const today = getTashkentDate();

  return (
    CYCLES.find(
      (cycle) => today >= cycle.start && today <= cycle.end
    ) ?? null
  );
}

export function getCycleByKey(key: string): Cycle | null {
  return CYCLES.find((cycle) => cycle.key === key) ?? null;
}