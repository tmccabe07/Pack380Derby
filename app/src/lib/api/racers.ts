// lib/api/Racers.js
import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Racer looks like
export interface Racer {
    id: string;
    name: string;
    role: "cub" | "sibling" | "adult";
    rank: "lion" | "tiger" | "wolf" | "bear" | "webelos" | "aol";
    den: string;
}

export async function getRacer(id: number): Promise<Racer> {
  const res = await fetch(`${DERBY_API_URL}/api/person/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch Racer");
  }
  return res.json();
}
export async function fetchRacers() {
  const res = await fetch(`${DERBY_API_URL}/api/person`);
  if (!res.ok) {
    throw new Error("Failed to fetch Racers");
  }
  return res.json();
}

export async function createRacer(Racer: Racer): Promise<Racer> {
  const res = await fetch(`${DERBY_API_URL}/api/person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Racer),
  });

  if (!res.ok) {
    throw new Error("Failed to create Racer");
  }

  return res.json();
}

export async function updateRacer(id: number, Racer: Racer): Promise<Racer> {
  const res = await fetch(`${DERBY_API_URL}/api/person/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Racer),
  });

  if (!res.ok) {
    throw new Error("Failed to update Racer");
  }

  return res.json();
}

export async function deleteRacer(id: number): Promise<void> {
  const res = await fetch(`${DERBY_API_URL}/api/person/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete Racer");
  }
}