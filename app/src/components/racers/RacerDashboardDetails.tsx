"use client";
import { useEffect, useState } from "react";
import { state } from "@/lib/utils/state";
import { fetchCarById, Car } from "@/lib/api/cars";
import CarCard from "@/components/cars/CarCard";
import CarHeatResults from "@/components/cars/CarHeatResults";

export default function RacerDashboardDetails() {
  const [racer, setRacer] = useState<any>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = state.getItem("logged_in_racer");
    if (stored) {
      try {
        setRacer(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    async function loadCar() {
      if (!racer?.id) return;
      setLoading(true);
      setError(null);
      try {
        const cars = await import("@/lib/api/cars").then(mod => mod.fetchCars(racer.id));
        if (cars && cars.length > 0) {
          setCar(cars[0]);
        } else {
          setCar(null);
        }
      } catch {
        setError("Failed to load car");
        setCar(null);
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [racer]);

  if (!racer) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Racer Details</h2>
      <div className="mb-4 p-4 border rounded bg-white">
        <div><span className="font-bold">Name:</span> {racer.name}</div>
        <div><span className="font-bold">Rank:</span> {racer.rank}</div>
        {racer.den && <div><span className="font-bold">Den:</span> {racer.den}</div>}
      </div>
      {loading ? (
        <div className="text-gray-500">Loading car...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : car ? (
        <>
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Car</h3>
            <CarCard car={car} />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Upcoming & Completed Heats</h3>
            <CarHeatResults car={car} />
          </div>
        </>
      ) : (
        <div className="text-gray-500">No car found for this racer.</div>
      )}
    </div>
  );
}
