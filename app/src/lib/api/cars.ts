import { DERBY_API_URL } from "@/lib/config/apiConfig";

export async function fetchCars() {
    const res = await fetch(`${DERBY_API_URL}/api/car`);
    if (!res.ok) {
      throw new Error("Failed to fetch cars");
    }
    return res.json();
  }

  export async function registerCar(racerId:string, carName:string) {
    const res = await fetch(`${DERBY_API_URL}/api/car`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ racerId, carName }),
    });
    if (!res.ok) {
      throw new Error("Failed to register car");
    }
    return res.json();
  }
  