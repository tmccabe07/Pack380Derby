"use client";
import { useState } from "react";
import { createRace } from "@/lib/api/races";

const raceTypes = [
  { value: 1, label: "Prelim" },
  { value: 10, label: "Quarterfinal" },
  { value: 20, label: "Semi" },
  { value: 30, label: "Final" },
];
const ranks = [
  "cub", "lion", "tiger", "wolf", "bear", "webelos", "aol", "sibling", "adult"
];

export default function RaceForm({ onCreate }: { onCreate: (race: any) => void }) {
  const [numLanes, setNumLanes] = useState(6);
  const [raceType, setRaceType] = useState(1);
  const [rank, setRank] = useState("cub");
  const [groupByRank, setGroupByRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (numLanes < 2 || numLanes > 6) {
      setError("Number of lanes must be between 2 and 6.");
      return;
    }
    onCreate({ numLanes, raceType, rank, groupByRank });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      <div>
        <label className="block font-bold mb-1">Number of Lanes</label>
        <input type="number" min={2} max={6} value={numLanes} onChange={e => setNumLanes(Number(e.target.value))} className="border p-2 w-24" />
      </div>
      <div>
        <label className="block font-bold mb-1">Race Type</label>
        <select value={raceType} onChange={e => setRaceType(Number(e.target.value))} className="border p-2 w-full">
          {raceTypes.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Rank</label>
        <select value={rank} onChange={e => setRank(e.target.value)} className="border p-2 w-full">
          {ranks.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={groupByRank} onChange={e => setGroupByRank(e.target.checked)} />
          <span className="ml-2">Group by Rank</span>
        </label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Race</button>
    </form>
  );
}
