"use client";
import RacerForm from "@/components/racers/RacerForm";
import { fetchRacerById, updateRacer, Racer } from "@/lib/api/racers";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Layout from "@/components/Layout";
import { useAdmin } from "@/hooks/useAdmin";

export default function EditRacerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();
  const [racer, setRacer] = useState<Racer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const r = await fetchRacerById(id);
        if (!ignore) setRacer(r);
      } catch {
        if (!ignore) setError("Failed to load racer");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  async function handleUpdateRacer(updatedRacer: Racer) {
    if (!id) return;
    try {
      await updateRacer(id, updatedRacer);
      router.push(withAdmin("/racers"));
    } catch (error) {
      console.error(error);
      alert("Failed to update racer");
    }
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-xl mt-10 p-4 rounded border border-red-200 bg-red-50 text-sm text-red-700">You are not authorized to edit racers.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-3xl font-bold">Edit Racer</h1>
        <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
          {loading && (
            <div className="animate-pulse h-32 rounded bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100" />
          )}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
          )}
          {!loading && !error && racer && (
            <RacerForm racer={racer} onSubmit={handleUpdateRacer} />
          )}
        </div>
      </div>
    </Layout>
  );
}