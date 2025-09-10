"use client";
import { useEffect, useState } from "react";
import { Car } from "@/lib/api/cars";
import { fetchRacers, Racer } from "@/lib/api/racers";

interface CarFormProps {
  onSubmit: (car: Omit<Car, "id">) => void;
}

export default function CarForm({ onSubmit }: CarFormProps) {
  const [car, setCar] = useState<Omit<Car, "id">>({
    name: "",
    image: "",
    year: new Date().getFullYear(),
    personId: 0,
    weight: "",
  });
  const [racers, setRacers] = useState<Racer[]>([]);

  useEffect(() => {
    fetchRacers().then(setRacers).catch(() => setRacers([]));
  }, []);

  function handleChange(field: keyof Omit<Car, "id">, value: any) {
    setCar((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(car);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-1">Car Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={car.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Image URL</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={car.image}
          onChange={(e) => handleChange("image", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Year</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={car.year}
          onChange={(e) => handleChange("year", parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Racer</label>
        <select
          className="border p-2 w-full"
          value={car.personId}
          onChange={(e) => handleChange("personId", parseInt(e.target.value))}
          required
        >
          <option value="" disabled>
            Select a racer
          </option>
          {racers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Weight</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={car.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Save Car
      </button>
    </form>
  );
}
