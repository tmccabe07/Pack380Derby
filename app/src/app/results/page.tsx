"use client";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { fetchResultsByRank } from "@/lib/api/results";
import { RankType } from "@/lib/api/racers";
import { RaceType } from "@/lib/api/races";
import { Leaderboard } from "@/components/results/Leaderboard";

export default function ResultsPage() {

  const [results, setResults] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const ranks = Object.values(RankType);
        const resultsObj: Record<string, any[]> = {};
        for (const rank of ranks) {
          try {
            const res = await fetchResultsByRank(rank);
            resultsObj[rank] = res;
          } catch {
            resultsObj[rank] = [];
          }
        }
        if (!cancelled) setResults(resultsObj);
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching results:", err);
          setError("Failed to fetch results");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-8">Race Results</h1>
          <div className="mb-8">
            <Leaderboard raceType={RaceType.Final} rank={RankType.Cub} />
          </div>

          <div className="mb-8">
            <Leaderboard raceType={RaceType.Final} rank={RankType.Sibling} />            
          </div>

          <div className="mb-8">
            <Leaderboard raceType={RaceType.Final} rank={RankType.Adult} />            
          </div>
        {loading && <div>Loading results...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <h2 className="text-2xl font-bold mb-8">Best of the rest...</h2>
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    

            {Object.entries(results).map(([rank, items]) => (
              <div key={rank} className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">{rank} Results</h2>
                {items.length === 0 ? (
                  <div className="text-gray-500">No results.</div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-2 text-left">Place</th>
                        <th className="py-2 px-2 text-left">Car</th>
                        <th className="py-2 px-2 text-left">Racer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((result: any, idx: number) => (
                        <tr key={result.carId || idx} className="border-t">
                          <td className="py-2 px-2">{result.place ?? idx + 1}</td>
                          <td className="py-2 px-2">
                            <a
                              href={`/cars/${result.carId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {result.car?.name || result.carId}
                            </a>
                          </td>
                          <td className="py-2 px-2">
                            <a
                              href={`/racers/${result.racerId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {result.car?.racer?.name || result.racerId}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
