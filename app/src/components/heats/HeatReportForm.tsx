"use client";
import { useState } from "react";

export default function HeatReportForm({ lanes, onReport }: { lanes: { lane: number; carId: string; carName?: string; racerName?: string }[]; onReport: (results: { lane: number; result: number }[]) => void }) {
  const [results, setResults] = useState<{ lane: number; result: number }[]>(
    lanes.map(l => ({ lane: l.lane, result: 0 }))
  );
  const [error, setError] = useState<string | null>(null);

  const updateResult = (lane: number, value: number) => {
    setResults(prev => prev.map(r => r.lane === lane ? { ...r, result: value } : r));
  };

  const submit = () => {
    // Require all lanes to have a result > 0
    if (results.some(r => !r.result || r.result <= 0)) {
      setError("All lanes must have a valid result (time)");
      return;
    }
    onReport(results);
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {lanes.map((lane, idx) => (
        <div key={lane.lane} className="flex space-x-2 items-center">
          <div>Lane {lane.lane}:</div>
          <span className="text-gray-700">{lane.carName} ({lane.racerName})</span>
          <input
            type="number"
            min="0"
            step="0.001"
            className="border p-2 w-32"
            value={results[idx].result}
            onChange={e => updateResult(lane.lane, parseFloat(e.target.value))}
            placeholder="Time (s)"
          />
        </div>
      ))}
      <div className="flex space-x-4 mt-6">
        <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Report Heat Results
        </button>
      </div>
    </div>
  );
}