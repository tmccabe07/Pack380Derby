import { fetchPinewoodAPI } from "./api";
export interface Person {
  id: number;
  name: string;
  // other racer properties
}

export interface Car {
  id: string;
  image: string;
  year: number;
  racerId: number;
  weight: string;
  name: string;
  racer?: Person;
}

export async function fetchPersonById(racerId: number): Promise<Person> {
  const res = await fetchPinewoodAPI(`/api/racer/${racerId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch racer");
  }
  return res.json();
}

// Patch fetchCars to attach the getter to each car
export async function fetchCars() {
  const res = await fetchPinewoodAPI(`/api/car`);
  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }
  const cars: Car[] = await res.json();
  // Fetch and attach racer for each car if not present
  await Promise.all(
    cars.map(async (car) => {
      if (!car.racer && car.racerId) {
        try {
          car.racer = await fetchPersonById(car.racerId);
        } catch {
          car.racer = undefined;
        }
      }
    })
  );
  return cars;
}

export async function createCar(car: Omit<Car, "id">): Promise<Car> {
  const res = await fetchPinewoodAPI(`/api/car`, {
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
  // attachRacerGetter(createdCar);
  return createdCar;
}

export async function fetchCarById(id: string): Promise<Car | null> {
  const res = await fetchPinewoodAPI(`/api/car/${id}`);
  if (!res.ok) return null;
  const car: Car = await res.json();
  if (car && car.racerId && !car.racer) {
    try {
      car.racer = await fetchPersonById(car.racerId);
    } catch {
      car.racer = undefined;
    }
  }
  return car;
}