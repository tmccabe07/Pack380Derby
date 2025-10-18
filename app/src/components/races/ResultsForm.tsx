"use client";
import { useState } from "react";
import { calculateResults } from "@/lib/api/races";

export default function ResultsForm() {
  const [sumBy, setSumBy] = useState(10);
  const [carId, setCarId] = useState(0);
  const [raceType, setRaceType] = useState(10);
  const [role, setRole] = useState("cub");
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await calculateResults({ sumBy, carId, raceType, role });
      setResults(res);
    } catch {
      setError("Failed to calculate results");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-bold mb-1">Sum By</label>
        <select value={sumBy} onChange={e => setSumBy(Number(e.target.value))} className="border p-2 w-full">
          <option value={10}>By Car & Race Type</option>
          <option value={20}>All Cars by Race Type</option>
          <option value={30}>All Cars by Role</option>
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Car ID (0 for all)</label>
        <input type="number" value={carId} onChange={e => setCarId(Number(e.target.value))} className="border p-2 w-full" />
      </div>
      <div>
        <label className="block font-bold mb-1">Race Type</label>
        <input type="number" value={raceType} onChange={e => setRaceType(Number(e.target.value))} className="border p-2 w-full" />
      </div>
      <div>
        <label className="block font-bold mb-1">Role</label>
        <input type="text" value={role} onChange={e => setRole(e.target.value)} className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Calculate Results</button>
      {loading && <div className="text-gray-500">Calculating...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {results && (
        <pre className="bg-gray-100 p-4 mt-4 rounded text-xs overflow-x-auto">{JSON.stringify(results, null, 2)}</pre>
      )}
    </form>
  );
}
