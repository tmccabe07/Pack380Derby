/**
 * Group flat heat lane list into a record keyed by heatId
 * @param lanes Array of HeatLane objects
 * @returns Record keyed by heatId
 */
export function groupHeatLanes(lanes: HeatEntry[]): Record<string, HeatEntry[]> {
  return lanes.reduce<Record<string, HeatEntry[]>>((acc, lane) => {
    const key = String((lane as any).heatId ?? "unknown");
    if (!acc[key]) acc[key] = [];
    acc[key].push(lane);
    return acc;
  }, {});
}

/**
 * Fetch all heats for a given raceId
 * @param raceId Race ID
 * @returns Array of Heat objects
 */
export async function fetchHeatsByRace(raceId: string): Promise<Heat[]> {
  const res = await fetch(`${DERBY_API_URL}/api/race/${raceId}/heats`);
  if (!res.ok) throw new Error("Failed to fetch heats for race");
  const heats = await res.json();
  console.log(`fetchHeatsByRace( ${raceId} ) -> `, heats);
  return heats;
}

/**
 * Fetch specific heat for a given raceId
 * @param raceId Race ID
 * @returns Array of Heat objects
 */
export async function fetchHeatByRaceHeat(raceId: string, heatId: string): Promise<Heat[]> {
  const res = await fetch(`${DERBY_API_URL}/api/race/${raceId}/heat/${heatId}`);
  if (!res.ok) throw new Error(`Failed to fetch heat ${heatId} for race ${raceId}`);
  const heat = {heatId: heatId, entries: await res.json()};
  console.log(`fetchHeatByRaceHeat( ${raceId} ) -> `, heat);
  return heat;
}

/**
 * Fetch heats grouped by rank for a given raceId
 * @param raceId Race ID
 * @returns Record of heats grouped by rank
 */
export async function fetchHeatsByRank(raceId: string): Promise<Record<string, Heat[]>> {
  const heats = await fetchHeatsByRace(raceId);
  return heats.reduce<Record<string, Heat[]>>((acc, heat) => {
    const rank = (heat as any).rank ?? "unknown";
    if (!acc[rank]) acc[rank] = [];
    acc[rank].push(heat);
    return acc;
  }, {});
}

/**
 * Report results for a heat by ID.
 * @param id - Heat ID
 * @param results - Array of lane/result objects
 * @returns Updated Heat object
 */
export async function reportHeat(id: string, results: { lane: number; result: number }[]): Promise<Heat> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results }),
  });
  if (!res.ok) {
    throw new Error("Failed to report heat results");
  }
  return res.json();
}
// lib/api/racers.js
import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Heat looks like
export interface HeatEntry {
  lane: number;
  carId: string | number;
  result?: number;
  car?: { id?: number | string; name?: string; racerId?: number | string; racer?: { id?: number | string; name?: string } };
}

export interface Heat {
  id?: string;
  entries: HeatEntry[];
  createdAt?: string;
  raceId?: string;
}

/**
 * Fetch all heats.
 * @returns Array of Heat objects
 */
export async function fetchHeats() {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane`);
  if (!res.ok) {
    throw new Error("Failed to fetch heats");
  }
  return res.json();
}

/**
 * Fetch a heat by its ID.
 * @param id - Heat ID
 * @returns Heat object or null if not found
 */
export async function fetchHeatById(id: string): Promise<Heat | null> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}`);
  if (!res.ok) return null;

  const heat = await res.json();
  console.log(`Fetched heat ID: ${id}`, heat);

  return heat;
}


/**
 * Create a new heat with entries and optional raceId.
 * @param entries - Array of HeatEntry objects
 * @param raceId - Optional race ID
 * @returns Created Heat object
 */
export async function createHeat(entries: HeatEntry[], raceId?: string): Promise<Heat> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raceId ? { entries, raceId } : { entries }),
  });
  if (!res.ok) {
    throw new Error("Failed to create heat");
  }
  return res.json();
}
/**
 * Update heat entries by ID.
 * @param id - Heat ID
 * @param entries - Array of HeatEntry objects to update
 * @returns Array of updated Heat objects
 */
export async function updateHeat(id: string, entries: HeatEntry[]): Promise<Heat[]> {
  const results: Heat[] = [];
  for (const entry of entries) {
    // Only send updatable fields (e.g., result and any additional fields in HeatEntry)
    const { result, ...rest } = entry;
    const body = { ...(result !== undefined ? { result } : {}), ...rest };
    const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${entry.id}/${result}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error("Failed to update heat entry");
    }
    results.push(await res.json());
  }
  return results;
}

/**
 * Delete a heat by its ID.
 * @param id - Heat ID
 * @returns True if deleted, false otherwise
 */
export async function deleteHeat(id: string): Promise<boolean> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}`, { method: "DELETE" });
  return res.ok;
}
