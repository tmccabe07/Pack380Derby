"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getVotingCategories } from "@/lib/api/competition";
// Import VotingCategory type
import { VotingCategory } from "@/types/VotingCategory";
import type { Car } from "@/lib/api/cars";
import { fetchCarsForCubs } from "@/lib/api/cars";
import { submitVote } from "@/lib/api/voting";
import type { VoteSubmission } from "@/types/VoteSubmission";
import CarCard from "@/components/cars/CarCard";
import { state } from "@/lib/utils/state";

export default function VotingPage() {
  const [categories, setCategories] = useState<VotingCategory[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<{ [cat: string]: string | number }>({});
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [catRes, carRes] = await Promise.all([
          getVotingCategories(),
          fetchCarsForCubs()
        ]);
        if (cancelled) return;
        setCategories(catRes || []);
        setCars(carRes);
        if (catRes && catRes.length > 0) setActiveCategory(catRes[0].id);
      } catch {
        if (!cancelled) setError("Failed to load voting data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleSelect(category: number, carId: string | number) {
    setSelected(prev => ({ ...prev, [category]: carId }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const voterRaw = state.getItem("voterId");
      const voterId = Number(voterRaw ?? 1);
      for (const category of categories) {
        const vote: VoteSubmission = {
          carId: Number(selected[category.id]),
          voterId,
          score: 1,
          categoryId: Number(category.id)
        };
        await submitVote(vote);
      }
      setSubmitted(true);
    } catch {
      setError("Failed to submit vote");
    }
  }

  if (loading) return <Layout><div className="text-center text-gray-500">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center text-red-500">{error}</div></Layout>;
  if (submitted) return <Layout><div className="text-center text-green-600 text-xl font-bold">Thank you for voting!</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Vote for...</h1>
      {/* Category Tabs */}
      <div className="flex gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            className={`px-4 py-2 rounded font-semibold border-2 transition-all flex items-center gap-2 ${activeCategory === category.id ? "border-blue-600 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-700"}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
            {selected[category.id] && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Selected</span>
            )}
          </button>
        ))}
      </div>

      {/* Show selected car for each category */}
      <div className="mb-8 flex flex-wrap gap-4">
        {categories.map(category => (
          selected[category.id] ? (
            <div key={category.id} className="flex items-center gap-2 border rounded px-3 py-2 bg-blue-50">
              <span className="font-semibold text-blue-700">{category.name}:</span>
              <CarCard car={cars.find(car => car.id === selected[category.id])!} onlyImage={true} />
            </div>
          ) : null
        ))}
      </div>

      {/* Car selection for active category */}
      {activeCategory && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg font-bold ${Object.keys(selected).length === categories.length && categories.every(cat => selected[cat.id]) ? "" : "opacity-50 cursor-not-allowed"}`}
            disabled={Object.keys(selected).length !== categories.length || !categories.every(cat => selected[cat.id])}
          >
            Submit Vote
          </button>
          <hr />          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{categories.find(cat => cat.id === activeCategory)?.name}</h2>
            {categories.find(cat => cat.id === activeCategory)?.description && (
              <div className="mb-4 text-gray-600 text-sm">
                {categories.find(cat => cat.id === activeCategory)?.description}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cars.map(car => (
                <div key={car.id} className={`border rounded-lg p-2 ${selected[activeCategory] === car.id ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
                  <button type="button" className="w-full" onClick={() => handleSelect(activeCategory, car.id)}>
                    <CarCard car={car} onlyImage={true} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </form>
      )}
    </Layout>
  );
}
