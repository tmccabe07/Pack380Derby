
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
  carId: string;
  result?: number;
  car?: any; // Optionally populated with car details
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

export async function updateHeat(id: string, entries: HeatEntry[]): Promise<Heat> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}` , {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) {
    throw new Error("Failed to update heat");
  }
  return res.json();
}

export async function deleteHeat(id: string): Promise<boolean> {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane/${id}`, { method: "DELETE" });
  return res.ok;
}
