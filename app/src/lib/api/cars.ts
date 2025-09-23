import { DERBY_API_URL } from "@/lib/config/apiConfig";
import { fetchRacerById } from "./racers";
import { Racer } from "./racers";
import { pinewoodKit } from "@/assets/images";

export interface Car {
  id: string;
  image: string;
  year: number;
  racerId: string;
  weight: string;
  name: string;
  racer?: Racer;
}


// Patch fetchCars to optionally filter by racerId
export async function fetchCars(racerId?: string) {
  const url = racerId
    ? `${DERBY_API_URL}/api/car?racerId=${encodeURIComponent(racerId)}`
    : `${DERBY_API_URL}/api/car`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }
  const cars: Car[] = await res.json();
  // Fetch and attach person for each car if not present
  await Promise.all(
    cars.map(async (car) => {
      if (!car.racer && car.racerId) {
        try {
          car.racer = await fetchRacerById(car.racerId);
          // default to pinewood kit if no image
          car.image = car.image || pinewoodKit;
        } catch (e) {
          car.racer = undefined;
        }
      }
    })
  );
  return cars;
}

export async function createCar(car: Omit<Car, "id">): Promise<Car> {
console.log("Creating car:", car);
  const res = await fetch(`${DERBY_API_URL}/api/car`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });

  if (!res.ok) {
    throw new Error("Failed to create car");
  }

  const createdCar: Car = await res.json();
  return createdCar;
}

export async function fetchCarById(id: string): Promise<Car | null> {
  const res = await fetch(`${DERBY_API_URL}/api/car/${id}`);
  if (!res.ok) return null;
  const car: Car = await res.json();
  if (car && car.personId && !car.racer) {
    try {
      car.racer = await fetchRacerById(car.personId);
    } catch {
      car.racer = undefined;
    }
  }
  return car;
}

export async function deleteCarById(id: string): Promise<boolean> {
  const res = await fetch(`${DERBY_API_URL}/api/car/${id}`, { method: "DELETE" });
  return res.ok;
}