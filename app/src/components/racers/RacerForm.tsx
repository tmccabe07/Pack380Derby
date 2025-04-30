"use client";
import { useState } from "react";
import { Racer } from "@/lib/api/racers";

interface RacerFormProps {
  onSubmit: (racer: Racer) => void;
}

export default function RacerForm({ onSubmit }: RacerFormProps) {
  const [racer, setRacer] = useState<Racer>({
    name: "",
    role: "Cub",
    rank: "lion",
    den: "",
  });

  function handleChange(field: keyof Racer, value: any) {
    setRacer((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(racer);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-1">Racer Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={racer.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Role</label>
        <select
          className="border p-2 w-full"
          value={racer.role}
          onChange={(e) => handleChange("role", e.target.value as Racer["role"])}
        >
          <option value="Cub">Cub</option>
          <option value="Sibling">Sibling</option>
          <option value="Adult">Adult</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Rank</label>
        <select
          className="border p-2 w-full"
          value={racer.rank}
          onChange={(e) => handleChange("rank", e.target.value as Racer["rank"])}
        >
          <option value="lion">Lion</option>
          <option value="tiger">Tiger</option>
          <option value="wolf">Wolf</option>
          <option value="bear">Bear</option>
          <option value="webelos">Webelos</option>
          <option value="aol">AOL</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Den</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={racer.den}
          onChange={(e) => handleChange("den", e.target.value)}
          required
        />
      </div>

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Save Racer
      </button>
    </form>
  );
}
