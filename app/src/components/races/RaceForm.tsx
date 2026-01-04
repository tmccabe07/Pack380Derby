"use client";
import { useState } from "react";
import { RACE_TYPE_LABELS, RaceType } from "@/lib/api/races";
import { Race } from "@/lib/api/races";
import { RacerType } from "@/lib/api/racers";
import { createableRaceTypes } from "@/lib/api/races";

const raceTypeOptions = createableRaceTypes.map(value => ({
  value,
  label: RACE_TYPE_LABELS[value]
}));

export default function RaceForm({ onCreate }: { onCreate: (race: Race) => void }) {
  const [numLanes, setNumLanes] = useState(6);  
  const [raceType, setRaceType] = useState<RaceType>(createableRaceTypes[0]);
  const [racerType, setRacerType] = useState<RacerType>(RacerType.CUB);
  const [groupByRank, setGroupByRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (numLanes < 2 || numLanes > 6) {
      setError("Number of lanes must be between 2 and 6.");
      return;
    }
    onCreate({ numLanes, raceType, racerType, groupByRank });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      <div>
        <label className="block font-bold mb-1">Number of Lanes</label>
        <input type="number" min={2} max={6} value={numLanes} onChange={e => setNumLanes(Number(e.target.value))} className="border p-2 w-24" />
      </div>
      <div>
        <label className="block font-bold mb-1">Create Race type</label>
        <select value={raceType} onChange={e => setRaceType(Number(e.target.value))} className="border p-2 w-full">
          {raceTypeOptions.map((rt: { value: number; label: string }) => (
            <option key={rt.value} value={rt.value}>{rt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Racer Type</label>
        <select value={racerType} onChange={e => setRacerType(e.target.value as RacerType)} className="border p-2 w-full">
          {Object.values(RacerType).map(r => <option key={r} value={r}>{r}</option>)}
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
