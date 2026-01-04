"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getVotingCategories } from "@/lib/api/competition";
import { getVoteScoresByCategory } from "@/lib/api/voting";
import { fetchCars, Car } from "@/lib/api/cars";
import CarCard from "@/components/cars/CarCard";
// import { useAdmin } from "@/hooks/useAdmin";
import { VoteScore } from "@/lib/api/voting";
import { VotingCategory } from "@/types/VotingCategory";
import { log } from "@/lib/utils/log";

export default function VotingAdminPage() {
  // const { isAdmin } = useAdmin();
  const [categories, setCategories] = useState<VotingCategory[]>([]);
  const [results, setResults] = useState<{ [cat: string]: { carId: string | number; votes: number }[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [catRes] = await Promise.all([
          getVotingCategories()        ]);
        if (cancelled) return;
        setCategories(catRes || []);        // Fetch votes for each category
        const resultsObj: { [cat: string]: { carId: string | number; votes: number }[] } = {};
        for (const category of catRes || []) {
          const voteScores = await getVoteScoresByCategory(String(category.id));
          resultsObj[category.id] = voteScores.map((vote: VoteScore) => ({
            carId: vote.carId,
            votes: vote.totalScore
          }));
          log(`Fetched category for voting: ${JSON.stringify(category)} => ${JSON.stringify(resultsObj[category.id])}`);

        }
        if (!cancelled) setResults(resultsObj);
      } catch {
        if (!cancelled) setError("Failed to load voting results");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // if (!isAdmin) return <Layout><div className="text-center text-red-600">Admin access required.</div></Layout>;
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    fetchCars().then(setCars).catch(() => setError("Failed to load cars"));
  }, []);

  if (loading) return <Layout><div className="text-center text-gray-500">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center text-red-500">{error}</div></Layout>;

  function getCar(carId: string | number): Car | undefined {
    return cars.find((c: Car) => String(c.id) === String(carId));
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Voting Results</h1>
      {categories.map(category => (
        <div key={category.id} className="mb-10">
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(results[category.id] || []).sort((a, b) => b.votes - a.votes).map(({ carId, votes }) => {
              const car = getCar(carId);
              return car ? (
                <div key={carId} className="border rounded-lg p-2 border-blue-600 bg-blue-50">
                  <CarCard car={car} />
                  <div className="mt-2 text-lg font-bold text-blue-700">Votes: {votes}</div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      ))}
    </Layout>
  );
}
