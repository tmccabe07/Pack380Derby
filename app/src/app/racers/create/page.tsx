"use client";
import RacerForm from "@/components/racers/RacerForm";
import { createRacer, Racer } from "@/lib/api/racers";
import { useRouter } from "next/navigation"; 
import Layout from "@/components/Layout";
import { useAdmin } from "@/hooks/useAdmin";

export default function CreateRacerPage() {
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();

  async function handleCreateRacer(racer: Racer) {
    try {
      await createRacer(racer);
      router.push(withAdmin("/racers"));
    } catch (error) {
      console.error(error);
      alert("Failed to create racer");
    }
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-xl mt-10 p-4 rounded border border-red-200 bg-red-50 text-sm text-red-700">You are not authorized to register racers.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-3xl font-bold">Register New Racer</h1>
        <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
          <RacerForm onSubmit={handleCreateRacer} />
        </div>
      </div>
    </Layout>
  );
}
