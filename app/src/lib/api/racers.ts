// lib/api/racers.js
import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Racer looks like
export interface Racer {
    id: number;
    name: string;
    carName: string;
    time?: number | null;
  }
  

export async function fetchRacers() {
  const res = await fetch(`${DERBY_API_URL}/api/person`);
  if (!res.ok) {
    throw new Error("Failed to fetch racers");
  }
  return res.json();
}

export async function registerRacer(name:string, role:string, rank:string, den:string) {
  const res = await fetch(`${DERBY_API_URL}/api/person`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role, rank, den }),
  });
  if (!res.ok) {
    throw new Error("Failed to register racer");
  }
  return res.json();
}
