"use client";
import RacerForm from "@/components/racers/RacerForm";
import { fetchRacerById, updateRacer, Racer } from "@/lib/api/racers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditRacerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [racer, setRacer] = useState<Racer | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }

    unwrapParams();
  }, [params]);

  useEffect(() => {
    async function fetchRacer() {
      if (!id) return;
      try {
        const racer = await fetchRacerById(id);
        setRacer(racer);
      } catch (error) {
        console.error(error);
        alert("Failed to load racer");
      }
    }

    fetchRacer();
  }, [id]);

  async function handleUpdateRacer(updatedRacer: Racer) {
    if (!id) return;
    try {
      await updateRacer(id, updatedRacer);
      router.push("/racers");
    } catch (error) {
      console.error(error);
      alert("Failed to update racer");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Racer</h1>
      {racer ? (
        <RacerForm racer={racer} onSubmit={handleUpdateRacer} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}