"use client";
import { useEffect, useState } from "react";
import {
  getConfiguration,
  setConfiguration,
  updateConfiguration,
  getMultipliers,
  setSemifinalMultiplier,
  updateSemifinalMultiplier,
  setFinalMultiplier,
  updateFinalMultiplier,
} from "@/lib/api/competition";
import { useAdmin } from "@/hooks/useAdmin";

export default function CompetitionConfig() {
  const [config, setConfig] = useState<any>(null);
  const [multipliers, setMultipliers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    Promise.all([getConfiguration(), getMultipliers()])
      .then(([cfg, mult]) => {
        setConfig(cfg);
        setMultipliers(mult);
      })
      .catch(() => setError("Failed to load competition config"))
      .finally(() => setLoading(false));
  }, []);

  async function handleConfigUpdate(e: React.FormEvent) {
    e.preventDefault();
    const numLanes = Number((e.target as any).numLanes.value);
    const usableLanes = (e.target as any).usableLanes.value.split(",").map((n: string) => Number(n.trim())).filter(Boolean);
    try {
      await updateConfiguration({ numLanes, usableLanes });
      setConfig(await getConfiguration());
    } catch {
      setError("Failed to update configuration");
    }
  }

  async function handleMultiplierUpdate(e: React.FormEvent) {
    e.preventDefault();
    const semi = Number((e.target as any).semifinal.value);
    const final = Number((e.target as any).final.value);
    try {
      await updateSemifinalMultiplier(semi);
      await updateFinalMultiplier(final);
      setMultipliers(await getMultipliers());
    } catch {
      setError("Failed to update multipliers");
    }
  }

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Lane Configuration</h2>
        <div className="mb-4">Total Lanes: <span className="font-mono">{config.numLanes}</span></div>
        <div className="mb-4">Usable Lanes: <span className="font-mono">{config.usableLanes?.join(", ")}</span></div>
        <form onSubmit={handleConfigUpdate} className="space-y-2">
          <label className="block font-bold">Update Lane Configuration</label>
          <input name="numLanes" type="number" min={1} max={6} defaultValue={config.numLanes} className="border p-2 w-24 mr-2" disabled={!isAdmin} />
          <input name="usableLanes" type="text" defaultValue={config.usableLanes?.join(", ")} className="border p-2 w-48 mr-2" disabled={!isAdmin} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!isAdmin}>Update</button>
        </form>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Race Multipliers</h2>
        <div className="mb-4">Semifinal Multiplier: <span className="font-mono">{multipliers.semifinalMultiplier}</span></div>
        <div className="mb-4">Final Multiplier: <span className="font-mono">{multipliers.finalMultiplier}</span></div>
        <form onSubmit={handleMultiplierUpdate} className="space-y-2">
          <label className="block font-bold">Update Multipliers</label>
          <input name="semifinal" type="number" min={1} max={10} defaultValue={multipliers.semifinalMultiplier} className="border p-2 w-24 mr-2" disabled={!isAdmin} />
          <input name="final" type="number" min={1} max={10} defaultValue={multipliers.finalMultiplier} className="border p-2 w-24 mr-2" disabled={!isAdmin} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!isAdmin}>Update</button>
        </form>
      </div>
    </div>
  );
}
