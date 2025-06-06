"use client";

import { fetchRacerById, deleteRacerById, Racer } from "@/lib/api/racers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RacerCard from "@/components/racers/RacerCard";
import { use } from 'react';
import Layout from "@/components/Layout";

export default function RacerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }= use(params);

  const [racer, setRacer] = useState<Racer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function loadRacer() {
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
        if (!ignore) {
          if (found) setRacer(found);
          else setError("Car not found");
        }
      } catch {
        if (!ignore) setError("Failed to load racer");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadRacer();
    return () => { ignore = true; };
  }, [id]);

  async function handleDelete() {
    if (!racer) return;
    if (!confirm("Are you sure you want to delete this racer?")) return;
    const ok = await deleteRacerById(racer.id);
    if (ok) {
      router.push("/racers");
    } else {
      alert("Failed to delete racer");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!racer) return null;

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8">
        <RacerCard racer={racer} />
        <button
          onClick={handleDelete}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Delete Racer
        </button>
      </div>
    </Layout>
  );
}