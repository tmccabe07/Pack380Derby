"use client"

import { useEffect, useState } from "react";
import { fetchHeats, Heat} from "@/lib/api/heats";
import HeatCard from "@/components/heats/HeatCard";


export default function HeatList() {
  const [heats, setHeats] = useState<Heat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadHeats() {
    try {
      const data = await fetchHeats();
      setHeats(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load heats.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHeats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading fetchHeats...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (heats.length === 0) {
    return <p className="text-center text-gray-500">No heats created yet.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Planned Heats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {heats.map((heat) => (
          <HeatCard key={heat.id} heat={heat} />
        ))}
      </div>
    </div>
  );
}
