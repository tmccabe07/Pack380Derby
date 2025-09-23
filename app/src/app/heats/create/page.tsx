"use client";

import Layout from "@/components/Layout";
import HeatForm from "@/components/heats/HeatForm";
import { createHeat, Heat } from "@/lib/api/heats";
import { useRouter } from "next/navigation";

export default function CreateHeatPage() {
  const router = useRouter();

  async function handleCreateHeat(heat: Heat) {
    try {
      await createHeat(heat["entries"]);
      router.push("/heats");
    } catch (error) {
      console.error(error);
      alert("Failed to create heat");
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Register New Heat</h1>
      <HeatForm onSubmit={handleCreateHeat} />
    </Layout>
  );
}
