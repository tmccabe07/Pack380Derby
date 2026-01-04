"use client"

import { useEffect, useState, useRef, memo } from "react";
import { fetchRacers, Racer, searchRacers } from "@/lib/api/racers";
import RacerCard from "@/components/racers/RacerCard";
// Parent component: only input re-renders; results handled by child
export default function RacerList() {
  const [search, setSearch] = useState("");

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Planned Racers</h2>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search racers by name..."
          className="border p-2 rounded w-64"
        />
      </div>
      <RacerResults search={search} />
    </div>
  );
}

// Child component: handles fetching & debounced searching
const RacerResults = memo(function RacerResults({ search }: { search: string }) {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadRacers() {
    setLoading(true);
    try {
      const data = await fetchRacers();
      setRacers(data);
    } catch {
      setError('Failed to load Racers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRacers();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        if (search.trim().length === 0) {
          await loadRacers();
        } else {
          const results = await searchRacers(search);
          setRacers(results);
        }
      } catch {
        setError("Failed to search Racers.");
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [search]);

  if (loading || searching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200/60 bg-white/50 backdrop-blur-sm p-5 shadow-sm animate-pulse flex flex-col gap-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="flex flex-wrap gap-4">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-14 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-3 mt-2">
              <div className="h-8 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return racers.length === 0 ? (
    <p className="text-center text-gray-500">No Racers found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {racers.map((racer) => (
        <RacerCard
          key={racer.id}
          racer={{
            ...racer,
            rank: racer.rank ?? import("@/lib/api/racers").RankType.Lion,
            den: racer.den ?? "",
          }}
        />
      ))}
    </div>
  );
});
