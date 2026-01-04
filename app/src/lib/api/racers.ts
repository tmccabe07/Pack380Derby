// lib/api/Racers.js
import { fetchPinewoodAPI } from "./api";

export enum RankType {
  Lion = "lion",
  Tiger = "tiger",
  Wolf = "wolf",
  Bear = "bear",
  Webelos = "webelos",
  AOL = "aol",
  Cub = "cub",
  Sibling = "sibling",
  Adult = "adult"
}

export enum RacerType {
  CUB = 'cub',
  SIBLING = 'sibling',
  ADULT = 'adult'
}

// Define what a Racer looks like
export interface Racer {
  id?: string;
  name: string;
  racerType?: RacerType | null;
  rank?: RankType;
  den?: string;
}

export async function fetchRacerById(racerId: string): Promise<Racer> {
  const res = await fetchPinewoodAPI(`/api/racer/${racerId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch racer");
  }
  return res.json();
}
export async function fetchRacers() {
  const res = await fetchPinewoodAPI(`/api/racer`);
  if (!res.ok) {
    throw new Error("Failed to fetch Racers");
  }
  const results = res.json();
  const racers = await results;
  return racers.filter((racer: Racer) => racer.name.toLowerCase() !== "blank");
}

export async function createRacer(racer: Racer): Promise<Racer> {
  const res = await fetchPinewoodAPI(`/api/racer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(racer),
  });

  if (!res.ok) {
    throw new Error("Failed to create Racer");
  }

  return res.json();
}

export async function updateRacer(id: string, racer: Racer): Promise<Racer> {
  const res = await fetchPinewoodAPI(`/api/racer/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(racer),
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
  const res = await fetchPinewoodAPI(`/api/racer/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete Racer");
  }
}

export async function searchRacers(query: string): Promise<Racer[]> {
  const res = await fetchPinewoodAPI(`/api/racer/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error("Failed to search Racers");
  }
  return res.json();
}