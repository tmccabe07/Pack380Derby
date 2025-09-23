"use client";

import Layout from "@/components/Layout";
import HeatForm from "@/components/heats/HeatForm";
import { createHeat } from "@/lib/api/heats";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

export default function CreateHeatPage() {
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();

  async function handleCreateHeat(entries: { lane: number; carId: string }[]) {
    try {
      await createHeat(entries);
      router.push(withAdmin("/heats"));
    } catch (error) {
      console.error(error);
      alert("Failed to create heat");
    }
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-xl text-sm text-red-600 bg-red-50 border border-red-200 rounded p-4 mt-8">You are not authorized to create heats.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Register New Heat</h1>
  <HeatForm onCreate={handleCreateHeat} />
    </Layout>
  );
}
