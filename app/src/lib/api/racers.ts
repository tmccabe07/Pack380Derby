// lib/api/racers.js
import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Racer looks like
export interface Racer {
    name: string;
    role: "Cub" | "Sibling" | "Adult";
    rank: "lion" | "tiger" | "wolf" | "bear" | "webelos" | "aol";
    den: string;
}


export async function fetchRacers() {
  const res = await fetch(`${DERBY_API_URL}/api/person`);
  if (!res.ok) {
    throw new Error("Failed to fetch racers");
  }
  return res.json();
}

export async function createRacer(racer: Racer): Promise<Racer> {
  const res = await fetch("/api/racers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(racer),
  });

  if (!res.ok) {
    throw new Error("Failed to create racer");
  }

  return res.json();
}