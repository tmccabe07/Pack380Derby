"use client";
import { useEffect, useState } from "react";
import { fetchRaces, Race } from "@/lib/api/races";
import { fetchHeats, Heat } from "@/lib/api/heats";
import Link from "next/link";

export default function RaceSummaryList() {
  const [races, setRaces] = useState<Race[]>([]);
  const [heats, setHeats] = useState<Heat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchRaces(), fetchHeats()])
      .then(([races, heats]) => {
        setRaces(races);
        setHeats(heats);
      })
      .catch(() => setError("Failed to load races or heats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading races...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (races.length === 0) return <div className="text-center text-gray-500">No races created yet.</div>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Races & Heats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {races.map(race => {
          const raceHeats = heats.filter(h => h.raceId === race.id);
          return (
            <div key={race.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-bold mb-4">Race #{race.id}</h3>
              <ul className="text-sm mb-4">
                <li>Type: {race.raceType}</li>
                <li>Rank: {race.rank}</li>
                <li>Lanes: {race.numLanes}</li>
                <li>Group By Rank: {race.groupByRank ? "Yes" : "No"}</li>
                <li>Heats: {raceHeats.length}</li>
              </ul>
              <div className="mb-2">
                {raceHeats.length === 0 ? (
                  <span className="text-gray-500">No heats assigned</span>
                ) : (
                  <ul className="list-disc ml-4">
                    {raceHeats.map(h => (
                      <li key={h.id}>
                        <Link href={`/heats/${h.id}`} className="text-blue-600 hover:underline">Heat #{h.id}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link href={`/races/${race.id}`} className="text-blue-600 hover:underline">View Race Details</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
