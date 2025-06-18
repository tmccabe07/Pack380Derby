"use client";
import { fetchCars, Car } from "@/lib/api/cars";
import { useEffect, useState } from "react";

export default function HeatForm({ onCreate, lanes = 6 }: { onCreate: (entries: any[]) => void, lanes?: number }) {
  const [entries, setEntries] = useState<{ lane: number; carId: string }[]>(
    Array.from({ length: lanes }, (_, i) => ({ lane: i + 1, carId: "" }))
  );
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCars().then(setCars);
  }, []);

  // Ensure each car can only be selected once
  const selectedCarIds = entries.map(e => e.carId).filter(Boolean);

  const updateEntry = (index: number, carId: string) => {
    const newEntries = [...entries];
    newEntries[index].carId = carId;
    setEntries(newEntries);
  };

  const validate = () => {
    const filledLanes = entries.filter(e => e.carId).length;
    if (filledLanes < 2) {
      return "At least two lanes must have a car selected.";
    }
    return null;
  };

  const submit = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    onCreate(entries);
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {entries.map((entry, idx) => (
        <div key={idx} className="flex space-x-2 items-center">
          <div>Lane {entry.lane}:</div>
          <select
            className="border p-2 flex-1"
            value={entry.carId}
            onChange={e => updateEntry(idx, e.target.value)}
          >
            <option value="">Select Car</option>
            {cars.map(car => (
              <option
                key={car.id}
                value={car.id}
                disabled={selectedCarIds.includes(car.id) && entry.carId !== car.id}
              >
                {car.name} ({car.racer?.name || car.personId})
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="flex space-x-4 mt-6">
        <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Heat
        </button>
      </div>
    </div>
  );
}
