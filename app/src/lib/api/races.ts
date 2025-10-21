import { DERBY_API_URL } from "@/lib/config/apiConfig";

export interface Race {
  id: string;
  numLanes: number;
  raceType: number;
  rank: string;
  groupByRank: boolean;
  createdAt?: string;
}

// Optional mapping of race type numbers to friendly labels (adjust as backend definition evolves)
export const RACE_TYPE_LABELS: Record<number, string> = {
  10: "Preliminary",
  20: "Semifinal",
  30: "Final",
};

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

export async function fetchRacesByType(raceType: number): Promise<Race[]> {
  const res = await fetch(`${DERBY_API_URL}/api/race/round/${raceType}`);
  if (!res.ok) throw new Error(`Failed to fetch races for raceType ${raceType}`);
  return res.json();
}

export interface HeatLane {
  id?: string; // heat-lane id if provided by backend
  heatId?: number;
  raceId?: number;
  lane: number;
  carId: number;
  result?: number; // place or time/result
  car?: CarSummary;
}

export interface CarSummary { id: number; name?: string; image?: string; racerId?: number; racer?: RacerSummary; }
export interface RacerSummary { id: number; name?: string; rank?: string; }

export async function fetchHeatsForRace(raceId: number) {
  const res = await fetch(`${DERBY_API_URL}/api/race/${raceId}/heats`);
  if (!res.ok) throw new Error(`Failed to fetch heats for race ${raceId}`);
  return res.json();
}

export async function fetchHeatLanes(raceId: number, heatId: number): Promise<HeatLane[]> {
  const res = await fetch(`${DERBY_API_URL}/api/race/${raceId}/heat/${heatId}`);
  if (!res.ok) throw new Error(`Failed to fetch heat lanes for heat ${heatId} race ${raceId}`);
  return res.json();
}

export async function calculateResults(data: {
  sumBy: number;
  carId: number;
  raceType: number;
  role: string;
}): Promise<unknown> {
  const res = await fetch(`${DERBY_API_URL}/api/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to calculate results");
  return res.json();
}