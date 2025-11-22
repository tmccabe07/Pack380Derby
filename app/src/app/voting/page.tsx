"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getVotingCategories } from "@/lib/api/competition";
// Import VotingCategory type
import { VotingCategory } from "@/types/VotingCategory";
import type { Car } from "@/lib/api/cars";
import { fetchCars } from "@/lib/api/cars";
import { submitVote } from "@/lib/api/voting";
import type { VoteSubmission } from "@/types/VoteSubmission";
import CarCard from "@/components/cars/CarCard";

export default function VotingPage() {
  const [categories, setCategories] = useState<VotingCategory[]>([]);
  // TODO: Replace with real user identifier logic
  const voterIdentifier = typeof window !== "undefined" ? (window.localStorage.getItem("voterIdentifier") || "anonymous") : "anonymous";
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<{ [cat: string]: string | number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [catRes, carRes] = await Promise.all([
          getVotingCategories(),
          fetchCars()
        ]);
        if (cancelled) return;
        console.log("Fetched voting categories:", catRes);
        setCategories(catRes || []);
        setCars(carRes);
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
      // TODO: Replace with real voterId logic
      const voterId = typeof window !== "undefined" ? Number(window.localStorage.getItem("voterId") || 1) : 1;
      for (const category of categories) {
        const vote: VoteSubmission = {
          carId: Number(selected[category.id]),
          voterId,
          score: 1, // Default score, update if needed
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
      <h1 className="text-3xl font-bold mb-6">Vote for Your Favorite Cars</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {categories.map(category => (
          <div key={category.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cars.map(car => (
                <div key={car.id} className={`border rounded-lg p-2 ${selected[category.id] === car.id ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
                  <button type="button" className="w-full" onClick={() => handleSelect(category.id, car.id)}>
                    <CarCard car={car} disableLink={true} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg font-bold">Submit Vote</button>
      </form>
    </Layout>
  );
}
