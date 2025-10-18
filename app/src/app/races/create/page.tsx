"use client";
import Layout from "@/components/Layout";
import RaceForm from "@/components/races/RaceForm";
import { createRace, Race } from "@/lib/api/races";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

export default function CreateRacePage() {
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();

  async function handleCreateRace(race: Omit<Race, "id">) {
    try {
      const created = await createRace(race);
      router.push(withAdmin(`/races/${created.id}`));
    } catch (error) {
      alert("Failed to create race");
    }
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-xl mt-10 p-4 rounded border border-red-200 bg-red-50 text-sm text-red-700">You are not authorized to create races.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-3xl font-bold">Create Race</h1>
        <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
          <RaceForm onCreate={handleCreateRace} />
        </div>
      </div>
    </Layout>
  );
}
