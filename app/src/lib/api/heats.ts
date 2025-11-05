
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

export async function fetchHeats() {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane`);
  if (!res.ok) {
    throw new Error("Failed to fetch heats");
  }
  return res.json();
}

export async function fetchHeatById(id: string): Promise<Heat | null> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}`);
  if (!res.ok) return null;
  return res.json();
}

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
export async function updateHeat(id: string, entries: HeatEntry[]): Promise<Heat[]> {
  const results: Heat[] = [];
  for (const entry of entries) {
    // Exclude 'carId' and 'lane' if you only want to send updatable fields, or specifically exclude 'id'
    // Here, we'll exclude 'carId', 'lane', and any 'id' property from the entry
    const { id, carId, raceId, car, result, ...rest } = entry;
    const body = { ...(result !== undefined ? { result } : {}), ...rest };
    const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("Failed to update heat entry");
    }
    results.push(await res.json());
  }
  return results;
}

export async function deleteHeat(id: string): Promise<boolean> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}`, { method: "DELETE" });
  return res.ok;
}
