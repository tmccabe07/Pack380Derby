"use client";

import { Car, fetchCarRaces, CarRaceEntry } from "@/lib/api/cars";
import { useEffect, useState } from "react";
import { state } from "@/lib/utils/state";
import Link from "next/link";

interface CarHeatResults {
  car: Car;
}

export default function CarHeatResults({ car }: CarHeatResults) {
  const [races, setRaces] = useState<CarRaceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchCarRaces(car.id);
        if (!cancelled) setRaces(data);
      } catch {
        if (!cancelled) setError("Failed to load car races");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [car.id]);

  // Get logged-in carId from session
  const loggedInCarId = state.getItem("logged_in_carId");
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">Races & Heats</h3>
        {loading && <span className="text-xs text-gray-500 animate-pulse">Loading...</span>}
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      {!loading && races.length === 0 && !error && (
        <div className="text-xs text-gray-500">No race participation recorded yet.</div>
      )}
      {races.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-2 text-left">Race</th>
                <th className="py-2 px-2 text-left">Heat</th>
                <th className="py-2 px-2 text-left">Lane</th>
                <th className="py-2 px-2 text-left">Place</th>
              </tr>
            </thead>
            <tbody>
              {races.map((r, idx) => {
                const isLoggedInCar = loggedInCarId && String(car.id) === String(loggedInCarId);
                return (
                  <tr
                    key={idx}
                    className={`border-t hover:bg-gray-50${isLoggedInCar ? ' bg-yellow-100 font-bold' : ''}`}
                  >
                    <td className="py-1 px-2">
                      <Link href={`/races/${r.raceId}`} className="text-blue-600 hover:underline">Race #{r.raceId}</Link>
                    </td>
                    <td className="py-1 px-2">
                      <Link href={`/races/${r.raceId}/heats/${r.heatId}`} className="text-blue-600 hover:underline">Heat {r.heatId}</Link>
                    </td>
                    <td className="py-1 px-2">{r.lane}</td>
                    <td className="py-1 px-2">{r.result ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
