"use client";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { fetchRacesByType, fetchHeatsForRace, RACE_TYPE_LABELS, Race, HeatLane } from "@/lib/api/races";
import Link from "next/link";

interface RaceWithHeats extends Race {
  heats?: HeatLane[][]; // array of heats, each heat is array of lanes
}

const RACE_TYPES = Object.keys(RACE_TYPE_LABELS).map(Number);

export default function RaceRoundsPage() {
  const [data, setData] = useState<Record<number, RaceWithHeats[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result: Record<number, RaceWithHeats[]> = {};
        for (const raceType of RACE_TYPES) {
          try {
            const races = await fetchRacesByType(raceType);
            const withHeats: RaceWithHeats[] = [];
            for (const r of races) {
              try {
                const heats = await fetchHeatsForRace(Number(r.id));
                withHeats.push({ ...r, heats });
              } catch {
                withHeats.push({ ...r });
              }
            }
            result[raceType] = withHeats;
          } catch {
            result[raceType] = [];
          }
        }
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Failed to load race rounds");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Layout>Loading race rounds...</Layout>;
  if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Race Rounds</h1>
      {RACE_TYPES.map(rt => {
        const races = data[rt] || [];
        return (
          <div key={rt} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{RACE_TYPE_LABELS[rt] || `Type ${rt}`} ({races.length})</h2>
            {races.length === 0 ? (
              <div className="text-gray-500 mb-6">No races for this round.</div>
            ) : (
              <div className="space-y-8">
                {races.map(race => (
                  <div key={race.id} className="border rounded-lg p-4 bg-white shadow">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-bold">Race #{race.id} - Rank {race.rank}</h3>
                        <p className="text-sm text-gray-600">Lanes: {race.numLanes} | Group By Rank: {race.groupByRank ? 'Yes' : 'No'}</p>
                      </div>
                      <Link href={`/races/${race.id}`} className="text-blue-600 hover:underline">View Race</Link>
                    </div>
                    <div>
                      {(race.heats || []).length === 0 ? (
                        <div className="text-gray-500 text-sm">No heats.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="py-2 px-2 text-left">Heat</th>
                                <th className="py-2 px-2 text-left">Entries</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(race.heats || []).map((heat: HeatLane[], idx: number) => {
                                const lanes = heat;
                                console.log("lanes", lanes)
                                return (
                                  <tr key={idx} className="border-t">
                                    <td className="py-2 px-2 align-top">Heat {idx + 1}</td>
                                    <td className="py-2 px-2">
                                      <ul className="space-y-1">
                                        {[].map((lane: HeatLane, li: number) => (
                                          <li key={li} className="flex gap-2">
                                            <span className="font-mono">Lane {lane.lane}</span>
                                            {lane.carId && (
                                              <>
                                                <Link href={`/cars/${lane.carId}`} className="text-blue-600 hover:underline">Car #{lane.carId}</Link>
                                                {lane.racer?.id && <Link href={`/racers/${lane.racer.id}`} className="text-green-600 hover:underline">Racer #{lane.racer.id}</Link>}
                                                <span className="text-gray-600">Place: {lane.result ?? 0}</span>
                                              </>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </Layout>
  );
}
