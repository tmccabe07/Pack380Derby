import { useEffect, useState } from "react";

export default function HeatForm({ onCreate }: { onCreate: (entries: any[]) => void }) {
  const [entries, setEntries] = useState([{ lane: 1, carName: "", racerName: "" }]);
  const [cars, setCars] = useState<{ name: string; carName: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const maxLanes = 6;

  useEffect(() => {
    // Load cars from API
    async function loadCars() {
      const res = await fetch('/api/car');
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    }
    loadCars();
  }, []);

  const addEntry = () => {
    if (entries.length < maxLanes) {
      setEntries([...entries, { lane: entries.length + 1, carName: "", racerName: "" }]);
    }
  };

  const updateEntry = (index: number, field: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const validate = () => {
    // Check for empty fields
    for (const entry of entries) {
      if (!entry.carName.trim() || !entry.racerName.trim()) {
        return "All lanes must have both Car Name and Racer Name filled out.";
      }
    }

    // Check for duplicate lanes
    const lanes = entries.map(e => e.lane);
    if (new Set(lanes).size !== lanes.length) {
      return "Each lane must be unique.";
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

  const autoFill = () => {
    const filled = cars.slice(0, maxLanes).map((car, idx) => ({
      lane: idx + 1,
      carName: car.carName,
      racerName: car.name,
    }));
    setEntries(filled);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 font-semibold">{error}</div>
      )}

      {entries.map((entry, idx) => (
        <div key={idx} className="flex space-x-2 items-center">
          <div>Lane {entry.lane}:</div>
          <input
            type="text"
            placeholder="Car Name"
            className="border p-2 flex-1"
            value={entry.carName}
            onChange={(e) => updateEntry(idx, "carName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Racer Name"
            className="border p-2 flex-1"
            value={entry.racerName}
            onChange={(e) => updateEntry(idx, "racerName", e.target.value)}
          />
        </div>
      ))}

      <div className="flex space-x-4 mt-6">
        <button onClick={addEntry} className="bg-gray-300 px-4 py-2 rounded">
          Add Lane
        </button>
        <button onClick={autoFill} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Auto Fill from Cars
        </button>
        <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Heat
        </button>
      </div>
    </div>
  );
}
