"use client";

import { fetchRacerById, deleteRacerById, Racer } from "@/lib/api/racers";
import { fetchCars, Car } from "@/lib/api/cars";
import CarCard from "@/components/cars/CarCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RacerCard from "@/components/racers/RacerCard";
import { use } from 'react';
import Layout from "@/components/Layout";
import { useAdmin } from "@/hooks/useAdmin";
import Link from "next/dist/client/link";
import { RacerType, RankType } from "../../../lib/api/racers";

export default function RacerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }= use(params);

  const [racer, setRacer] = useState<Racer | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();

  useEffect(() => {
    let ignore = false;
    async function loadRacerAndCars() {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError("Racer ID is required");
          setLoading(false);
          return;
        }
        setRacer(null);
        setError(null);
        // Fetch the racer by ID
        const found = await fetchRacerById(id);
        // Fetch cars for this racer only
        const carsForRacer = await fetchCars(id);
        if (!ignore) {
          if (found) setRacer(found);
          else setError("Racer not found");
          setCars(carsForRacer);
        }
      } catch {
        if (!ignore) setError("Failed to load racer");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadRacerAndCars();
    return () => { ignore = true; };
  }, [id]);

  async function handleDelete() {
    if (!racer) return;
    if (!confirm("Are you sure you want to delete this racer?")) return;
    try {
      await deleteRacerById(racer.id);
      router.push(withAdmin("/racers"));
    } catch {
      alert("Failed to delete racer");
    }
  }

  if (loading) return <Layout><div className="max-w-3xl mx-auto animate-pulse mt-10 h-40 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100" /></Layout>;
  if (error) return <Layout><div className="text-red-500 max-w-3xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-lg">{error}</div></Layout>;
  if (!racer) return null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto mt-10 space-y-10">
        <section className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur px-6 py-5 shadow-sm flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="flex-1 space-y-4">
              <RacerCard racer={{
                id: racer.id,
                name: racer.name,
                rank: racer.rank ?? RankType.Lion,
                den: racer.den ?? ""
              }} />
            </div>
            {isAdmin && (
              <div className="flex flex-col gap-3 w-full md:w-auto md:items-end">
                <Link
                  href={`/racers/${racer.id}/edit?admin=${isAdmin}`}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex justify-center items-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2"
                >
                  Delete Racer
                </button>
              </div>
            )}
          </div>
        </section>
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">Cars</h2>
          {cars.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-gray-500 text-sm">No cars registered for this racer.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}