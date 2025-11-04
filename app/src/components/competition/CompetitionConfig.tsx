"use client";
import { useEffect, useState } from "react";
import {
  getConfiguration,
  updateConfiguration,
  getMultipliers,
  updateSemifinalMultiplier,
  updateFinalMultiplier,
  getVotingCategories,
  setVotingCategories,
} from "@/lib/api/competition";
import { useAdmin } from "@/hooks/useAdmin";

export default function CompetitionConfig() {
  const [config, setConfig] = useState<{ numLanes: number; usableLanes: number[] } | null>(null);
  const [multipliers, setMultipliers] = useState<{ semifinalMultiplier: number; finalMultiplier: number } | null>(null);
  const [votingCategories, setVotingCategories] = useState<{ name: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    Promise.all([getConfiguration(), getMultipliers(), getVotingCategories()])
      .then(([cfg, mult, cats]) => {
        setConfig(cfg);
        setMultipliers(mult);
        // cats.categories is expected to be array of { name, description }
        setVotingCategories(cats.categories || []);
      })
      .catch(() => setError("Failed to load competition config"))
      .finally(() => setLoading(false));
  }, []);

  async function handleVotingCategoriesUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const names = Array.from(form.querySelectorAll('[name^="category-name-"]')) as HTMLInputElement[];
    const descriptions = Array.from(form.querySelectorAll('[name^="category-description-"]')) as HTMLInputElement[];
    const categories = names.map((input, idx) => ({
      name: input.value.trim(),
      description: descriptions[idx]?.value.trim() || ""
    })).filter(cat => cat.name);
    try {
      await setVotingCategories(categories);
      setVotingCategories(categories);
    } catch {
      setError("Failed to update voting categories");
    }
  }

  async function handleConfigUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const numLanes = Number((form.numLanes as HTMLInputElement).value);
    const usableLanes = (form.usableLanes as HTMLInputElement).value.split(",").map((n: string) => Number(n.trim())).filter(Boolean);
    try {
      await updateConfiguration({ numLanes, usableLanes });
      setConfig(await getConfiguration());
    } catch {
      setError("Failed to update configuration");
    }
  }

  async function handleMultiplierUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const semi = Number((form.semifinal as HTMLInputElement).value);
    const final = Number((form.final as HTMLInputElement).value);
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
        <h2 className="text-xl font-bold mb-4">Voting Categories</h2>
        <div className="mb-4">
          <span className="font-bold">Current Categories:</span>
          <ul className="list-disc ml-6">
            {votingCategories.length === 0 ? <li className="font-mono">None</li> : votingCategories.map((cat, idx) => (
              <li key={idx}>
                <span className="font-mono">{cat.name}</span>
                {cat.description && <span className="text-gray-500 ml-2">({cat.description})</span>}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleVotingCategoriesUpdate} className="space-y-2">
          <label className="block font-bold mb-2">Edit Voting Categories</label>
          {votingCategories.map((cat, idx) => (
            <div key={idx} className="flex space-x-2 mb-2">
              <input
                name={`category-name-${idx}`}
                type="text"
                defaultValue={cat.name}
                placeholder="Category Name"
                className="border p-2 w-48"
                disabled={!isAdmin}
              />
              <input
                name={`category-description-${idx}`}
                type="text"
                defaultValue={cat.description}
                placeholder="Description"
                className="border p-2 w-64"
                disabled={!isAdmin}
              />
            </div>
          ))}
          {/* Add new category row */}
          <div className="flex space-x-2 mb-2">
            <input
              name={`category-name-${votingCategories.length}`}
              type="text"
              placeholder="New Category Name"
              className="border p-2 w-48"
              disabled={!isAdmin}
            />
            <input
              name={`category-description-${votingCategories.length}`}
              type="text"
              placeholder="New Description"
              className="border p-2 w-64"
              disabled={!isAdmin}
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!isAdmin}>Update</button>
        </form>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Lane Configuration</h2>
        {config ? (
          <>
            <div className="mb-4">Total Lanes: <span className="font-mono">{config.numLanes}</span></div>
            <div className="mb-4">Usable Lanes: <span className="font-mono">{config.usableLanes?.join(", ")}</span></div>
            <form onSubmit={handleConfigUpdate} className="space-y-2">
              <label className="block font-bold">Update Lane Configuration</label>
              <input name="numLanes" type="number" min={1} max={6} defaultValue={config.numLanes} className="border p-2 w-24 mr-2" disabled={!isAdmin} />
              <input name="usableLanes" type="text" defaultValue={config.usableLanes?.join(", ")} className="border p-2 w-48 mr-2" disabled={!isAdmin} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!isAdmin}>Update</button>
            </form>
          </>
        ) : (
          <div className="text-gray-500">Loading lane configuration...</div>
        )}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Race Multipliers</h2>
        {multipliers ? (
          <>
            <div className="mb-4">Semifinal Multiplier: <span className="font-mono">{multipliers.semifinalMultiplier}</span></div>
            <div className="mb-4">Final Multiplier: <span className="font-mono">{multipliers.finalMultiplier}</span></div>
            <form onSubmit={handleMultiplierUpdate} className="space-y-2">
              <label className="block font-bold">Update Multipliers</label>
              <input name="semifinal" type="number" min={1} max={10} defaultValue={multipliers.semifinalMultiplier} className="border p-2 w-24 mr-2" disabled={!isAdmin} />
              <input name="final" type="number" min={1} max={10} defaultValue={multipliers.finalMultiplier} className="border p-2 w-24 mr-2" disabled={!isAdmin} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!isAdmin}>Update</button>
            </form>
          </>
        ) : (
          <div className="text-gray-500">Loading multipliers...</div>
        )}
      </div>
    </div>
  );
}
