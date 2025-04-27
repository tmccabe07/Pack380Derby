import { DERBY_API_URL } from "@/lib/config/apiConfig";

export async function fetchDashboardCounts() {
    const resCars = await fetch(`${DERBY_API_URL}/api/car`);
    const resPeople = await fetch(`${DERBY_API_URL}/api/person`);
    const cars = await resCars.json();
    const people = await resPeople.json();
    if (!resCars.ok || !resPeople.ok) {
      throw new Error('Failed to fetch dashboard counts');
    }
    return {
        cars: cars.length || 0,
        racers: people.length || 0,
    }
  }