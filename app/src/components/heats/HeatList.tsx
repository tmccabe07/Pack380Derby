"use client"

import { HeatEntry } from "@/lib/api/heats";
import HeatCard from "@/components/heats/HeatCard";


export default function HeatList({ heatsByRank }: { heatsByRank: Record<string, Record<string, HeatEntry[]>> }) {
  if (!heatsByRank || Object.keys(heatsByRank).length === 0) {
    return <p className="text-center text-gray-500">No heats created yet.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Planned Heats</h2>
      {Object.entries(heatsByRank).map(([rank, heatsObj]) => (
        <div key={rank} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Rank: {rank}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {Object.entries(heatsObj).map(([heatId, entries]) => (
              <HeatCard key={heatId} heat={{ id: heatId, entries }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
