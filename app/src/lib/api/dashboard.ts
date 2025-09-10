import { DERBY_API_URL } from "@/lib/config/apiConfig";
import { fetchCars } from "./cars";
import { fetchRacers } from "./racers";

export async function fetchDashboardCounts() {
  const [cars, racers] = await Promise.all([fetchCars(), fetchRacers()]);
  
  return {
    cars: cars.length || 0,
    racers: racers.length || 0,
  };
}
