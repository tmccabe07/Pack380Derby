import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function HeatDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [heat, setHeat] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/heats/${id}`)
        .then(res => res.json())
        .then(data => setHeat(data));
    }
  }, [id]);

  async function submitTimes() {
    const entries = heat.entries.map((entry: any) => ({
      id: entry.id,
      time: parseFloat(entry.time),
    }));

    await fetch(`/api/heats/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    });

    alert('Times saved!');
  }

  if (!heat) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Heat #{heat.id}</h1>

      <div className="space-y-4 mb-8">
        {heat.entries.map((entry: any, idx: number) => (
          <div key={entry.id} className="flex space-x-4">
            <div className="w-24 font-semibold">Lane {entry.lane}</div>
            <div className="flex-1">{entry.carName} ({entry.racerName})</div>
            <input
              type="number"
              step="0.001"
              placeholder="Time (s)"
              className="border p-2 w-32"
              value={entry.time ?? ''}
              onChange={(e) => {
                const updated = { ...entry, time: e.target.value };
                const newEntries = [...heat.entries];
                newEntries[idx] = updated;
                setHeat({ ...heat, entries: newEntries });
              }}
            />
          </div>
        ))}
      </div>

      <button onClick={submitTimes} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Save Times
      </button>
    </Layout>
  );
}
