"use client";
import { useEffect, useState } from "react";
import { Racer, searchRacers } from "@/lib/api/racers";
import { fetchCars } from "@/lib/api/cars";
import { state } from "@/lib/utils/state";

export default function RacerLoginSelect({ onChange }: { onChange?: (racer: Racer | null) => void }) {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Racer[]>([]);
  const [selected, setSelected] = useState<Racer | null>(null);

  useEffect(() => {
    const stored = state.getItem("logged_in_racer");
    if (stored) {
      try {
        setSelected(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (search.length > 1) {
      setSearching(true);
      searchRacers(search)
        .then(setResults)
        .finally(() => setSearching(false));
    } else {
      setResults([]);
    }
  }, [search]);

  async function handleSelect(racer: Racer) {
    setSelected(racer);
    state.setItem("logged_in_racer", JSON.stringify(racer));
    // Fetch car for racer and store carId in session
    try {
      const cars = await fetchCars(racer.id);
      if (cars && cars.length > 0) {
        state.setItem("logged_in_carId", cars[0].id);
      } else {
        state.removeItem("logged_in_carId");
      }
    } catch {
      state.removeItem("logged_in_carId");
    }
    onChange?.(racer);
  }

  function handleChangeRacer() {
    setSelected(null);
    state.removeItem("logged_in_racer");
    state.removeItem("logged_in_carId");
    onChange?.(null);
  }

  return (
    <div className="mb-6 p-4 border rounded bg-white">
      {selected ? (
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold">Logged in as:</span> {selected.name} (Rank: {selected.rank}{selected.den ? `, Den: ${selected.den}` : ""})
          </div>
          <button className="ml-4 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleChangeRacer}>
            Change Racer
          </button>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-lg mb-2">Choose Racer</h3>
          <label className="block text-sm font-bold mb-1">Search Racer</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type 2+ characters..."
          />
          {searching && <div className="text-gray-500">Searching...</div>}
          {results.length > 0 && (
            <ul className="border rounded mt-2 bg-white max-h-48 overflow-auto">
              {results.map(r => (
                <li
                  key={r.id}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSelect(r)}
                >
                  {r.name} (Rank: {r.rank}{r.den ? `, Den: ${r.den}` : ""})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
