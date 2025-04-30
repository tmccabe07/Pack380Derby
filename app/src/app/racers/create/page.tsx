"use client";
import RacerForm from "@/components/racers/RacerForm";
import { createRacer } from "@/lib/api/racers";
import { useRouter } from "next/navigation"; 

export default function CreateRacerPage() {
  const router = useRouter();

  async function handleCreateRacer(racer: any) {
    try {
      await createRacer(racer);
      router.push("/pages/racers"); // ✅ navigate back to the list
    } catch (error) {
      console.error(error);
      alert("Failed to create racer");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Register New Racer</h1>
      <RacerForm onSubmit={handleCreateRacer} />
    </div>
  );
}
