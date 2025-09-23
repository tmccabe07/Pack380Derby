"use client";

import { fetchCarById, Car, deleteCarById } from "@/lib/api/cars";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCard from "@/components/cars/CarCard";
import { use } from 'react';
import Layout from "@/components/Layout";
import CarHeatResults from "@/components/cars/CarHeatResults";
import { useAdmin } from "@/hooks/useAdmin";

export default function CarViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }= use(params);

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();

  useEffect(() => {
    let ignore = false;
    async function loadCar() {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError("Car ID is required");
          setLoading(false);
          return;
        }
        setCar(null);
        setError(null);
        // Fetch the car by ID
        const found = await fetchCarById(id);
        if (!ignore) {
          if (found) setCar(found);
          else setError("Car not found");
        }
      } catch {
        if (!ignore) setError("Failed to load car");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadCar();
    return () => { ignore = true; };
  }, [id]);

  async function handleDelete() {
    if (!car) return;
    if (!confirm("Are you sure you want to delete this car?")) return;
    const ok = await deleteCarById(car.id);
    if (ok) {
      router.push(withAdmin("/cars"));
    } else {
      alert("Failed to delete car");
    }
  }

  if (loading) return <Layout><div className="max-w-3xl mx-auto animate-pulse mt-10 h-40 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100" /></Layout>;
  if (error) return <Layout><div className="text-red-500 max-w-3xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-lg">{error}</div></Layout>;
  if (!car) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10 space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="flex-1 space-y-4">
              <CarCard car={car} />
            </div>
            {isAdmin && (
              <div className="flex flex-col gap-3 w-full md:w-auto md:items-end">
                <button
                  onClick={handleDelete}
                  className="inline-flex justify-center items-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2"
                >
                  Delete Car
                </button>
              </div>
            )}
          </div>
        </section>
        <section>
          <CarHeatResults car={car} />
        </section>
      </div>
    </Layout>
  );
}