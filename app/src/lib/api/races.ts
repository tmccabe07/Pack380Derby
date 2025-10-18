import { DERBY_API_URL } from "@/lib/config/apiConfig";

export interface Race {
  id: string;
  numLanes: number;
  raceType: number;
  rank: string;
  groupByRank: boolean;
  createdAt?: string;
}

export async function createRace(data: {
  numLanes: number;
  raceType: number;
  rank: string;
  groupByRank: boolean;
}): Promise<Race> {
  const res = await fetch(`${DERBY_API_URL}/api/race`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create race");
  return res.json();
}

export async function fetchRaces(): Promise<Race[]> {
  const res = await fetch(`${DERBY_API_URL}/api/race`);
  if (!res.ok) throw new Error("Failed to fetch races");
  return res.json();
}

export async function fetchRaceById(id: string): Promise<Race | null> {
  const res = await fetch(`${DERBY_API_URL}/api/race/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function calculateResults(data: {
  sumBy: number;
  carId: number;
  raceType: number;
  role: string;
}): Promise<any> {
  const res = await fetch(`${DERBY_API_URL}/api/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to calculate results");
  return res.json();
}