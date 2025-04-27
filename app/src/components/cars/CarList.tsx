"use client"
// components/CarList.tsx
import { useEffect, useState } from "react";
import { fetchRacers, Racer} from "@/lib/api/racers";


export default function CarList() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRacers() {
    try {
      const data = await fetchRacers();
      setRacers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load racers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRacers();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading cars...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (racers.length === 0) {
    return <p className="text-center text-gray-500">No cars registered yet.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Registered Cars</h2>
      <ul className="space-y-2">
        {racers.map((racer) => (
          <li
            key={racer.id}
            className="border p-4 rounded shadow-sm hover:shadow-md transition"
          >
            <CarCard racer={racer} />
          </li>
        ))}
      </ul>
    </div>
  );
}
