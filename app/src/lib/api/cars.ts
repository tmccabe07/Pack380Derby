import { DERBY_API_URL } from "@/lib/config/apiConfig";

// Define what a Car looks like
export interface Car {
  id: string;
  image: string;
  year: number;
  racerId: number;
  weight: string;
  name: string;
}
  
export async function fetchCars() {
    const res = await fetch(`${DERBY_API_URL}/api/car`);
    if (!res.ok) {
      throw new Error("Failed to fetch cars");
    }
    return res.json();
  }

 
export async function createCar(car: Omit<Car, "id">): Promise<Car> {
  const res = await fetch("/api/car", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });

  if (!res.ok) {
    throw new Error("Failed to create car");
  }

  return res.json();
}