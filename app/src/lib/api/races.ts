import { fetchPinewoodAPI } from "./api";
import { RankType } from "./racers";
import { logger } from "@/lib/utils/log";

// Race with heats grouped by rankType and heatId
export interface RaceWithRankedHeats extends Race {
  heatsByRank?: Record<RankType, Record<number, HeatLane[]>>;
}

// RaceType enum based on server README
export enum RaceType {
  Initialize = 1,
  Preliminary = 10,
  PreliminaryDeadheat = 40,
  Semifinal = 20,
  SemifinalDeadheat = 50,
  Final = 30,
}

export interface Race {
  id?: string;
  numLanes: number;
  raceType: RaceType;
  rank: RankType;
  groupByRank: boolean;
  createdAt?: string;
}

// Optional mapping of race type enum to friendly labels
export const RACE_TYPE_LABELS: Record<RaceType, string> = {
  [RaceType.Initialize]: "Initialize",
  [RaceType.Preliminary]: "Preliminary",
  [RaceType.PreliminaryDeadheat]: "Preliminary Deadheat",
  [RaceType.Semifinal]: "Semifinal",
  [RaceType.SemifinalDeadheat]: "Semifinal Deadheat",
  [RaceType.Final]: "Final",
};

export async function createRace(data: {
  numLanes: number;
  raceType: RaceType;
  rank: RankType;
  groupByRank: boolean;
}): Promise<Race> {
    const res = await fetchPinewoodAPI(`/api/race`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  if (!res.ok) throw new Error("Failed to create race");
  return res.json();
}

export async function fetchRaces(): Promise<Race[]> {
  const res = await fetchPinewoodAPI(`/api/race`);
  if (!res.ok) throw new Error("Failed to fetch races");
  const races = await res.json();
  logger.debug("races", "fetchRaces()", races);
  return races
}

export async function fetchRaceById(id: string): Promise<Race | null> {
  const res = await fetchPinewoodAPI(`/api/race/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchRacesByType(raceType: RaceType): Promise<Race[]> {
  const res = await fetchPinewoodAPI(`/api/race/round/${raceType}`);
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
  status?: "Upcoming" | "Completed";
}

export interface CarSummary { id: number; name?: string; image?: string; racerId?: number; racer?: RacerSummary; }
export interface RacerSummary { id: number; name?: string; rank?: string; }

export async function fetchHeatsForRace(raceId: number): Promise<Record<RankType, Record<number, HeatLane[]>>> {
  const res = await fetchPinewoodAPI(`/api/race/${raceId}/heats`);
  if (!res.ok) throw new Error(`Failed to fetch heats for race ${raceId}`);
  const heatLanes: HeatLane[] = await res.json();

  // Group by rankType, then by heatId
  // Explicitly initialize all RankType keys to ensure type safety
  const initialAcc: Record<RankType, Record<number, HeatLane[]>> = {
    [RankType.Lion]: {},
    [RankType.Tiger]: {},
    [RankType.Wolf]: {},
    [RankType.Bear]: {},
    [RankType.Webelos]: {},
    [RankType.Cub]: {},
    [RankType.AOL]: {},
    [RankType.Adult]: {},
    [RankType.Sibling]: {},
  };

  // Helper to compute status for a heat
  function computeStatus(lanes: HeatLane[]): "Upcoming" | "Completed" {
    return lanes.length > 0 && lanes.every(l => typeof l.result === "number" && l.result > 0)
      ? "Completed"
      : "Upcoming";
  }

  const hl = heatLanes.reduce<Record<RankType, Record<number, HeatLane[]>>>((acc, lane) => {
    const rank: RankType = (lane.car?.racer?.rank as RankType) || RankType.Cub;
    if (!acc[rank]) acc[rank] = {};
    if (lane.heatId !== undefined) {
      if (!acc[rank][lane.heatId]) acc[rank][lane.heatId] = [];
      acc[rank][lane.heatId].push(lane);
    }
    return acc;
  }, initialAcc);

  // Add status to each heat group
  Object.entries(hl).forEach(([, heatsById]) => {
    Object.entries(heatsById).forEach(([, lanes]) => {
      const status = computeStatus(lanes);
      lanes.forEach(lane => {
        lane.status = status;
      });
    });
  });

  logger.debug("races", "Grouped heat lanes by rank and heatId with status", hl);
  return hl;
}

export async function fetchHeatLanes(raceId: number, heatId: number): Promise<HeatLane[]> {
  const res = await fetchPinewoodAPI(`/api/race/${raceId}/heat/${heatId}`);
  if (!res.ok) throw new Error(`Failed to fetch heat lanes for heat ${heatId} race ${raceId}`);
  return res.json();
}

// Fetch leaderboard results by raceType and rankType
export interface RaceResult {
  carId: number;
  carName?: string;
  racerId?: number;
  racerName?: string;
  rank: RankType;
  raceType: RaceType;
  totalPlace: number; // e.g., place or time
}

export async function fetchResultsByRank(
  raceType: RaceType,
  rank: RankType
): Promise<RaceResult[]> {
    const res = await fetchPinewoodAPI(`/api/results/by-rank/${raceType}/${rank}`);
  if (!res.ok) throw new Error(`Failed to fetch results for raceType ${raceType} and rank ${rank}`);
  return res.json();
}