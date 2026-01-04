import { fetchPinewoodAPI } from "./api";
import { RacerType, fetchRacerById } from "./racers";
import { Racer } from "./racers";
import { pinewoodKit } from "@/assets/images";
import { RankType } from "@/lib/api/racers";

export interface Car {
  id: string;
  image: string;
  year: number;
  racerId: string;
  weight: string;
  name: string;
  racer?: Racer;
}

export interface CarRaceEntry {
  raceId: number;
  heatId: number;
  lane: number;
  result?: number;
  raceType?: number;
}

/**
 * Fetch a car by its ID, attaching racer if needed.
 * @param carId - Car ID
 * @returns Car object or null if not found
 */
export async function fetchCarById(carId: string): Promise<Car | null> {
  const res = await fetchPinewoodAPI(`/api/car/${carId}`);
  if (!res.ok) return null;
  const car: Car = await res.json();
  if (car && car.racerId && !car.racer) {
    try {
      car.racer = await fetchRacerById(car.racerId);
    } catch {
      car.racer = undefined;
    }
  }
  return car;
}

/**
 * Fetch cars by rank using the RankType enum.
 * @param rank - RankType value
 * @returns Array of Car objects
 */
export async function fetchCarsByRank(rank: RankType): Promise<Car[]> {
  const res = await fetchPinewoodAPI(`/api/car/byRank/${rank}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch cars for rank: ${rank}`);
  }
  const cars: Car[] = await res.json();
  const results = await Promise.all(cars.map(enrichCar));
  // Filter out cars where the name is "blank"
  const filteredResults = results.filter(car => car.name.toLowerCase() !== "blank");
  return filteredResults;
}

/**
 * Fetch cars by cub, sibling, or adult using the RacerType enum.
 * @param type - RacerType value
 * @returns Array of Car objects
 */
export async function fetchCarsByRacerType(type: RacerType): Promise<Car[]> {
  const res = await fetchPinewoodAPI(`/api/car/byRacerType/${type}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch cars for racer type: ${type}`);
  }
  const cars: Car[] = await res.json();
  const results = await Promise.all(cars.map(enrichCar));
  // Filter out cars where the name is "blank"
  const filteredResults = results.filter(car => car.name.toLowerCase() !== "blank");
  return filteredResults;

}

/**
 * Fetch all cars for cub ranks (Tiger, Lion, Bear, Wolf, Webelos, AOL).
 * @returns Array of Car objects for all cub ranks
 */
export async function fetchCarsForCubs(): Promise<Car[]> {
  const cubRanks: RacerType[] = [
    RacerType.CUB
    // RankType.Tiger,
    // RankType.Lion,
    // RankType.Bear,
    // RankType.Wolf,
    // RankType.Webelos,
    // RankType.AOL
  ];
  const results = await Promise.all(cubRanks.map(rank => fetchCarsByRacerType(rank)));
  const cars = results.flat();
  
  return cars;
}



/**
 * Fetch all cars, optionally filtered by racerId. Attaches racer and normalizes image.
 * @param racerId - Optional racer ID to filter
 * @returns Array of Car objects
 */
export async function fetchCars(racerId?: string) {
  const url = racerId
    ? `/api/car?racerId=${encodeURIComponent(racerId)}`
    : `/api/car`;
  const res = await fetchPinewoodAPI(url);
  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }
  const cars: Car[] = await res.json();
  const results = await Promise.all(cars.map(enrichCar));
  // Filter out cars where the name is "blank"
  const filteredResults = results.filter(car => car.name.toLowerCase() !== "blank");
  return filteredResults;
}

/**
 * Enrich a car object by attaching racer and normalizing image.
 * @param car - Car object
 */
export async function enrichCar(car: Car): Promise<Car> {
  
  if (!car.racer && car.racerId) {
    try {
      car.racer = await fetchRacerById(car.racerId);
      car.image = car.image || pinewoodKit;
    } catch {
      car.racer = undefined;
    }
  }
  if (car.image && car.image.startsWith("data:")) {
    const commaIndex = car.image.indexOf(",");
    if (commaIndex !== -1) {
      car.image = car.image.slice(commaIndex + 1);
    }
  }
  return car;
}

/**
 * Create a new car entry.
 * @param newCar - Car data (without ID)
 * @returns Created Car object
 */
export async function createCar(newCar: Omit<Car, "id">): Promise<Car> {
  const res = await fetchPinewoodAPI(`/api/car`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCar),
  });

  if (!res.ok) {
    throw new Error("Failed to create car");
  }

  const createdCar: Car = await res.json();
  return createdCar;
}

/**
 * Update an existing car by ID.
 * @param id - Car ID to update
 * @param car - Car data (without ID)
 * @returns Updated Car object
 */
export async function updateCar(id: string, car: Omit<Car, "id">): Promise<Car> {
  const res = await fetchPinewoodAPI(`/api/car/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  if (!res.ok) {
    throw new Error("Failed to update car");
  }
  return res.json();
}

/**
 * Fetch all race entries for a car.
 * @param carId - Car ID
 * @returns Array of CarRaceEntry objects
 */
export async function fetchCarRaces(carId: string | number): Promise<CarRaceEntry[]> {
  const res = await fetchPinewoodAPI(`/api/car/${carId}/races`);
  if (!res.ok) throw new Error("Failed to fetch car races");
  return res.json();
}

// Normalize car image: if base64 without data URI prefix, add jpeg prefix.
/**
 * Normalize car image string to a valid data URI or external URL.
 * @param image - Car image string
 * @returns Valid image URI string
 */
export function getCarImage(image?: string): string {
  if (!image) return "";
  // If already a data URI or external URL, return unchanged
  if (image.startsWith("data:") || image.startsWith("http")) return image;
  // Heuristic: base64 strings often contain / or + and are long; just prefix.
  return `data:image/jpeg;base64,${image}`;
}

/**
 * Delete a car by its ID.
 * @param carId - Car ID
 * @returns True if deleted, false otherwise
 */
export async function deleteCarById(carId: string): Promise<boolean> {
  const res = await fetchPinewoodAPI(`/api/car/${carId}`, { method: "DELETE" });
  return res.ok;
}