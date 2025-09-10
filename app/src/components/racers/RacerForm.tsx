"use client";
import { useState } from "react";
import { Racer } from "@/lib/api/racers";

interface RacerFormProps {
  racer?: Racer; // Optional racer for editing
  onSubmit: (racer: Racer) => void;
}

export default function RacerForm({ racer: initialRacer, onSubmit }: RacerFormProps) {
  const [racer, setRacer] = useState<Racer>(
    initialRacer || {
      name: "",
      role: "cub",
      rank: "lion",
      den: "",
    }
  );

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
        <label htmlFor="name" className="block text-sm font-bold mb-1">Racer Name</label>
        <input
          id="name"
          type="text"
          className="border p-2 w-full"
          value={racer.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label  htmlFor="role" className="block text-sm font-bold mb-1">Role</label>
        <select
          id="role"
          className="border p-2 w-full"
          value={racer.role}
          onChange={(e) => handleChange("role", e.target.value as Racer["role"])}
        >
          <option value="cub">Cub</option>
          <option value="sibling">Sibling</option>
          <option value="adult">Adult</option>
        </select>
      </div>

      <div>
        <label  htmlFor="rank" className="block text-sm font-bold mb-1">Rank</label>
        <select
          id="rank"
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
        <label  htmlFor="den" className="block text-sm font-bold mb-1">Den</label>
        <input
          id="den"
          type="text"
          className="border p-2 w-full"
          value={racer.den}
          onChange={(e) => handleChange("den", e.target.value)}
          required
        />
      </div>

      <button name="save" type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Save Racer
      </button>
    </form>
  );
}
