import Layout from "@/components/Layout";
import HeatForm from "@/components/heats/HeatForm";
import { useRouter } from "next/router";

export default function CreateHeatPage() {
  const router = useRouter();

  async function handleCreate(entries: any[]) {
    await fetch('/api/heats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    });
    router.push('/heats');
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Create New Heat</h1>
      <HeatForm onCreate={handleCreate} />
    </Layout>
  );
}
