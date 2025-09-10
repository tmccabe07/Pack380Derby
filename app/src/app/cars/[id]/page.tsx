"use client";

import { fetchCarById, Car, deleteCarById } from "@/lib/api/cars";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCard from "@/components/cars/CarCard";
import { use } from 'react';
import Layout from "@/components/Layout";

export default function CarViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }= use(params);

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      router.push("/cars");
    } else {
      alert("Failed to delete car");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!car) return null;

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8">
        <CarCard car={car} />
        <button
          onClick={handleDelete}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Delete Car
        </button>
      </div>
    </Layout>
  );
}