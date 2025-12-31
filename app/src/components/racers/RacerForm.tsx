"use client";
import { useState, useEffect } from "react";
import { Racer, searchRacers, RankType } from "@/lib/api/racers";

type RoleType = "scout" | "sibling" | "adult";

interface RacerFormProps {
  racer?: Racer; // Optional racer for editing
  onSubmit: (racer: Racer) => void;
}

export default function RacerForm({ racer: initialRacer, onSubmit }: RacerFormProps) {
  const [role, setRole] = useState<RoleType>("scout");
  const [racer, setRacer] = useState<Racer>(
    initialRacer || {
      name: "",
      rank: RankType.Lion,
      den: "",
    }
  );
  const [search, setSearch] = useState("");
  const [scoutResults, setScoutResults] = useState<Racer[]>([]);
  const [selectedScout, setSelectedScout] = useState<Racer | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (role === "scout" && search.length > 1) {
      setSearching(true);
      searchRacers(search)
        .then(setScoutResults)
        .finally(() => setSearching(false));
    } else {
      setScoutResults([]);
    }
  }, [search, role]);

  function handleChange<K extends keyof Racer>(field: K, value: Racer[K]) {
    setRacer((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "scout" && selectedScout) {
      onSubmit(selectedScout);
    } else if (role === "sibling" || role === "adult") {
      const mappedRank = role === "sibling" ? RankType.Sibling : RankType.Adult;
      onSubmit({ ...racer, rank: mappedRank });
    } else {
      onSubmit(racer);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-1">Role</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input type="radio" name="role" value="scout" checked={role === "scout"} onChange={() => setRole("scout")} />
            <span className="ml-2">Scout</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="role" value="sibling" checked={role === "sibling"} onChange={() => setRole("sibling")} />
            <span className="ml-2">Sibling</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="role" value="adult" checked={role === "adult"} onChange={() => setRole("adult")} />
            <span className="ml-2">Adult</span>
          </label>
        </div>
      </div>

      {role === "scout" && (
        <div>
          <label className="block text-sm font-bold mb-1">Search Scout Name</label>
          <input
            type="text"
            aria-label="name"
            className="border p-2 w-full"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedScout(null); }}
            placeholder="Type to search..."
          />
          {searching && <div className="text-gray-500">Searching...</div>}
          {scoutResults.length > 0 && (
            <ul className="border rounded mt-2 bg-white">
              {scoutResults.map(s => (
                <li key={s.id} className={`p-2 cursor-pointer hover:bg-blue-100 ${selectedScout?.id === s.id ? "bg-blue-200" : ""}`}
                  onClick={() => setSelectedScout(s)}>
                  {s.name} (Rank: {s.rank}, Den: {s.den})
                </li>
              ))}
            </ul>
          )}
          {selectedScout && (
            <div className="mt-4 p-3 bg-gray-50 border rounded">
              <div><span className="font-bold">Name:</span> {selectedScout.name}</div>
              <div><span className="font-bold">Rank:</span> {selectedScout.rank}</div>
              <div><span className="font-bold">Den:</span> {selectedScout.den}</div>
            </div>
          )}
        </div>
      )}

      {(role === "sibling" || role === "adult") && (
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">Name</label>
          <input
            id="name"
            type="text"
            className="border p-2 w-full"
            value={racer.name}
            onChange={e => handleChange("name", e.target.value)}
            required
          />
        </div>
      )}


      <button name="save" type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Save Racer
      </button>
    </form>
  );
}
