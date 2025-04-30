// lib/api/racers.js
import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Heat looks like
export interface Heat {
  carId: number;
  result: number;
  lane: number;
}
  

export async function fetchHeats() {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane`);
  if (!res.ok) {
    throw new Error("Failed to fetch heats");
  }
  return res.json();
}

export async function createHeat(carId:string, result:string, lane:string) {
  const res = await fetch(`${DERBY_API_URL}/api/heat-lane`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carId, result, lane }),
  });
  if (!res.ok) {
    throw new Error("Failed to create heat");
  }
  return res.json();
}
