"use client"

import { useEffect, useState } from "react";
import { fetchRacers, Racer} from "@/lib/api/racers";
import RacerCard from "@/components/racers/RacerCard";


export default function RacerList() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRacers() {
    try {
      const data = await fetchRacers();
      setRacers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load Racers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRacers();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading fetchRacers...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (racers.length === 0) {
    return <p className="text-center text-gray-500">No Racers created yet.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Planned Racers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {racers.map((racer) => (
          <RacerCard key={racer.id} racer={racer} />
        ))}
      </div>
    </div>
  );
}
