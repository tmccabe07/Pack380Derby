"use client";
import { useEffect, useState } from "react";
import { Racer, createRacer, searchRacers } from "@/lib/api/racers";
import { Car, createCar, fetchCars, updateCar } from "@/lib/api/cars";
import CarForm from "@/components/cars/CarForm";

type RoleType = "scout" | "sibling" | "adult";

export default function RegistrationForm({ onRegistered }: { onRegistered?: () => void }) {
  // Role / racer selection state
  const [role, setRole] = useState<RoleType>("scout");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [scoutResults, setScoutResults] = useState<Racer[]>([]);
  const [selectedScout, setSelectedScout] = useState<Racer | null>(null);
  const [newRacerName, setNewRacerName] = useState("");

  // Car state
  const currentYear = new Date().getFullYear();
  const [car, setCar] = useState<Omit<Car, "id">>({
    name: "",
    image: "",
    year: currentYear,
    racerId: "", // will set on submit
    weight: "",
  });
  // Track existing car id if editing
  const [existingCarId, setExistingCarId] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // Remove local image handling; delegated to CarForm

  // Load scout results as the user types
  useEffect(() => {
    if (role === "scout" && search.length > 1) {
      setSearching(true);
      searchRacers(search)
        .then(setScoutResults)
        .finally(() => setSearching(false));
    } else {
      setScoutResults([]);
      setSelectedScout(null);
      setExistingCarId(null);
      // reset car if leaving scout role
      setCar({ name: "", image: "", year: currentYear, racerId: "", weight: "" });
    }
  }, [role, search, currentYear]);

  // When a scout is selected, attempt to load existing car
  useEffect(() => {
    async function loadCar() {
      if (selectedScout) {
        try {
          const cars = await fetchCars(String(selectedScout.id));
          const existing = cars.find(c => c.year === currentYear);
          
          if (existing) {
            setExistingCarId(existing.id);
            setCar({
              name: existing.name,
              image: existing.image,
              year: existing.year,
              racerId: existing.racerId,
              weight: existing.weight,
            });
          } else {
            setExistingCarId(null);
            setCar({ name: "", image: "", year: currentYear, racerId: "", weight: "" });
          }
        } catch {
          setExistingCarId(null);
        }
      } else {
        setExistingCarId(null);
      }
    }
    loadCar();
  }, [selectedScout, currentYear]);

  // Car changes handled via CarForm onChange


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let racerId: string;
      if (role === "scout") {
        if (!selectedScout) throw new Error("Please select a scout");
        racerId = String(selectedScout.id);
      } else {
        if (!newRacerName.trim()) throw new Error("Enter a name for the racer");
        const created = await createRacer({ name: newRacerName.trim(), rank: role, den: role });
        racerId = String(created.id);
      }
      // Determine create vs update
      if (existingCarId) {
        await updateCar(existingCarId, { ...car, racerId });
      } else {
        await createCar({ ...car, racerId });
      }
      setDone(true);
      onRegistered?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = () => {
    if (role === "scout") return !!selectedScout && !!car.name;
    return !!newRacerName.trim() && !!car.name;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h2 className="text-xl font-bold">Register Racer & Car</h2>
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {!done && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
          {/* Racer Section */}
          <div className="space-y-4 p-4 border rounded bg-white">
            <h3 className="font-semibold text-lg">Racer Information</h3>
            <div>
              <label className="block text-sm font-bold mb-1">Role</label>
              <div className="flex space-x-4">
                {(["scout", "sibling", "adult"] as RoleType[]).map(r => (
                  <label key={r} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                    />
                    <span className="ml-2 capitalize">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {role === "scout" && (
              <div>
                <label className="block text-sm font-bold mb-1">Search Scout</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedScout(null); }}
                  placeholder="Type 2+ characters..."
                />
                {searching && <div className="text-gray-500">Searching...</div>}
                {scoutResults.length > 0 && (
                  <ul className="border rounded mt-2 bg-white max-h-48 overflow-auto">
                    {scoutResults.map(s => (
                      <li
                        key={s.id}
                        className={`p-2 cursor-pointer hover:bg-blue-100 ${selectedScout?.id === s.id ? "bg-blue-200" : ""}`}
                        onClick={() => setSelectedScout(s)}
                      >
                        {s.name} (Rank: {s.rank as import("@/lib/api/racers").RankType}{s.den ? `, Den: ${s.den}` : ""})
                      </li>
                    ))}
                  </ul>
                )}
                {selectedScout && (
                  <div className="mt-3 p-3 bg-gray-50 border rounded text-sm">
                    <div><span className="font-bold">Selected:</span> {selectedScout.name}</div>
                    <div>Rank: {selectedScout.rank}</div>
                    {selectedScout.den && <div>Den: {selectedScout.den}</div>}
                  </div>
                )}
              </div>
            )}

            {(role === "sibling" || role === "adult") && (
              <div>
                <label className="block text-sm font-bold mb-1">Name</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={newRacerName}
                  onChange={e => setNewRacerName(e.target.value)}
                  placeholder="Enter racer name"
                  required
                />
              </div>
            )}
          </div>

          {/* Car Section using CarForm */}
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold text-lg mb-4">Car Information</h3>
            <CarForm
              car={car}
              racer={selectedScout || { id: "temp", name: newRacerName || "New Racer", rank: role === "scout" ? "lion" : role, den: "" }}
              onChange={setCar}
              hideSubmit
            />
          </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !canSubmit()}
              className="bg-green-600 disabled:opacity-50 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {loading ? "Saving..." : "Complete Registration"}
            </button>
          </div>
        </>
      )}

      {done && (
        <div className="text-green-700 font-semibold">Registration complete!</div>
      )}
    </form>
  );
}
