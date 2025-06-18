// lib/api/Racers.js
import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Racer looks like
export interface Racer {
    id?: string;
    name: string;
    role: "cub" | "sibling" | "adult";
    rank: "lion" | "tiger" | "wolf" | "bear" | "webelos" | "aol";
    den: string;
}

export async function fetchRacerById(racerId: string): Promise<Racer> {
  const res = await fetch(`${DERBY_API_URL}/api/racer/${racerId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch racer");
  }
  return res.json();
}
export async function fetchRacers() {
  const res = await fetch(`${DERBY_API_URL}/api/racer`);
  if (!res.ok) {
    throw new Error("Failed to fetch Racers");
  }
  return res.json();
}

export async function createRacer(Racer: Racer): Promise<Racer> {
  const res = await fetch(`${DERBY_API_URL}/api/racer`, {
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

export async function updateRacer(id: string, Racer: Racer): Promise<Racer> {
  const res = await fetch(`${DERBY_API_URL}/api/racer/${id}`, {
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

export async function deleteRacerById(id?: string): Promise<void> {
  if (!id) {
    throw new Error("Racer ID is required for deletion");
  }
  const res = await fetch(`${DERBY_API_URL}/api/racer/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete Racer");
  }
}