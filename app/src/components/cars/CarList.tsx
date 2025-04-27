"use client"
// components/CarList.tsx
import { useEffect, useState } from "react";
import { fetchCars, Car} from "@/lib/api/cars";
import CarCard from "./CarCard";


export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCars() {
    try {
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load cars.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading cars...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (cars.length === 0) {
    return <p className="text-center text-gray-500">No cars registered yet.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Registered Cars</h2>
      <ul className="space-y-2">
        {cars.map((car) => (
          <li
            key={car.id}
            className="border p-4 rounded shadow-sm hover:shadow-md transition"
          >
            <CarCard car={car} />
          </li>
        ))}
      </ul>
    </div>
  );
}
