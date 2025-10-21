"use client";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { fetchHeatLanes, HeatLane, RACE_TYPE_LABELS, fetchRaceById } from "@/lib/api/races";
import Link from "next/link";

export default function HeatDetailPage({ params }: { params: { id: string; heatId: string } }) {
  const { id, heatId } = params;
  const [lanes, setLanes] = useState<HeatLane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raceType, setRaceType] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [race, lanesData] = await Promise.all([
          fetchRaceById(id),
          fetchHeatLanes(Number(id), Number(heatId))
        ]);
        if (!race) throw new Error('Race not found');
        if (!cancelled) {
          setRaceType(race.raceType);
          setLanes(lanesData);
        }
      } catch {
        if (!cancelled) setError('Failed to load heat');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, heatId]);

  if (loading) return <Layout>Loading heat...</Layout>;
  if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;

  const allResults = lanes.every(l => typeof l.result === 'number' && l.result! > 0);
  const status = allResults ? 'Completed' : 'Upcoming';

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Heat {heatId} (Race {id})</h1>
      <p className="mb-4 text-gray-700">Round: {raceType !== null ? (RACE_TYPE_LABELS[raceType] || raceType) : '—'} | Status: {status}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 text-left">Lane</th>
              <th className="py-2 px-2 text-left">Car</th>
              <th className="py-2 px-2 text-left">Racer</th>
              <th className="py-2 px-2 text-left">Place</th>
            </tr>
          </thead>
          <tbody>
            {lanes.map((lane, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 px-2">{lane.lane}</td>
                <td className="py-2 px-2">{lane.carId ? <Link href={`/cars/${lane.carId}`} className="text-blue-600 hover:underline">{lane.car?.name}</Link> : '—'}</td>
                <td className="py-2 px-2">{lane.car?.racer ? <Link href={`/racers/${lane.car?.racerId}`} className="text-green-600 hover:underline">{lane.car?.racer?.name}</Link> : '—'}</td>
                <td className="py-2 px-2">{lane.result ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-4">
        <Link href={`/races/${id}`} className="text-blue-600 hover:underline">Back to Race</Link>
        <Link href={`/rounds`} className="text-blue-600 hover:underline">Back to Rounds</Link>
      </div>
    </Layout>
  );
}
