"use client";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { fetchRacesByType, fetchHeatsForRace, RACE_TYPE_LABELS, Race, HeatLane } from "@/lib/api/races";
import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";


interface RaceWithHeats extends Race {
  heats?: HeatLane[][];
  heatsByRank?: Record<string, Record<string, HeatLane[]>>;
}

const RACE_TYPES = Object.keys(RACE_TYPE_LABELS).map(Number);

export default function RacesPage() {
  const [data, setData] = useState<Record<number, RaceWithHeats[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { withAdmin } = useAdmin();

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
                const heatsByRank = await fetchHeatsForRace(Number(r.id));
                withHeats.push({ ...r, heatsByRank });
              } catch {
                withHeats.push({ ...r });
              }
            }
            result[raceType] = withHeats;
          } catch {
            result[raceType] = [];
          }
        }
        if (!cancelled) {
          console.log("Fetched race rounds data:", result);
          setData(result)
        };
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
        console.log(`Rendering races for race type ${rt}:`, races);
        return (
          <div key={rt} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{RACE_TYPE_LABELS[rt as keyof typeof RACE_TYPE_LABELS] || `Type ${rt}`} ({races.length})</h2>
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
                      {race.heatsByRank ? (
                        Object.entries(race.heatsByRank)
                          .filter(([_, heatsById]) => Object.keys(heatsById).length > 0)
                          .map(([rank, heatsById]) => (
                            <div key={rank} className="mb-6">
                              <h4 className="text-lg font-semibold mb-2">{rank.charAt(0).toUpperCase() + rank.slice(1)} Heats</h4>
                              <table className="min-w-full text-sm mb-4">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="py-2 px-2 text-left">Heat</th>
                                    <th className="py-2 px-2 text-left">Cars (lane order)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(heatsById).map(([heatId, lanes]) => (
                                    <tr key={heatId} className="border-t">
                                      <td className="py-2 px-2 align-top">
                                        Heat {heatId}
                                        {races.length > 0 && (
                                          <>
                                            {' '}
                                            <Link href={withAdmin(`/races/${race.id}/heats/${heatId}`)} className="text-blue-600 hover:underline text-xs ml-2">View Heat</Link>
                                          </>
                                        )}
                                      </td>
                                      <td className="py-2 px-2">
                                        {lanes
                                          .sort((a, b) => a.lane - b.lane)
                                          .map((lane, idx) => (
                                            <span key={lane.carId}>
                                              {/* Admin-only: wrap car name with link */}
                                              <span className="admin">
                                                <Link href={withAdmin(`/cars/${lane.carId}`)} className="text-blue-600 hover:underline">
                                                  {lane.car?.name || `Car #${lane.carId}`}
                                                </Link>
                                              </span>
                                              {idx < lanes.length - 1 && ", "}
                                            </span>
                                          ))}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))
                      ) : (
                        <div className="text-gray-500 text-sm">No heats.</div>
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
