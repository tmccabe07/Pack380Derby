import { DERBY_API_URL } from "@/lib/config/apiConfig";
export interface Person {
  id: number;
  name: string;
  // other person properties
}

export interface Car {
  id: string;
  image: string;
  year: number;
  personId: number;
  weight: string;
  name: string;
  racer?: Person;
}

export async function fetchPersonById(personId: number): Promise<Person> {
  const res = await fetch(`${DERBY_API_URL}/api/person/${personId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch person");
  }
  return res.json();
}

// Patch fetchCars to attach the getter to each car
export async function fetchCars() {
  const res = await fetch(`${DERBY_API_URL}/api/car`);
  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }
  const cars: Car[] = await res.json();
  // Fetch and attach person for each car if not present
  await Promise.all(
    cars.map(async (car) => {
      if (!car.racer && car.personId) {
        try {
          car.racer = await fetchPersonById(car.personId);
        } catch (e) {
          car.racer = undefined;
        }
      }
    })
  );
  return cars;
}

export async function createCar(car: Omit<Car, "id">): Promise<Car> {
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
      car.racer = await fetchPersonById(car.personId);
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