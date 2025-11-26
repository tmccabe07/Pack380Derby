"use client";

import { useRouter } from "next/navigation";
import { use } from 'react';
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { fetchHeatById, deleteHeat, updateHeat, reportHeat, Heat, HeatEntry } from "@/lib/api/heats";
import { Car, fetchCars } from "@/lib/api/cars";
import HeatForm from "@/components/heats/HeatForm";
import HeatReportForm from "@/components/heats/HeatReportForm";

export default function HeatDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id }= use(params);
  const [heat, setHeat] = useState<Heat | null>(null);
  const [editing, setEditing] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchHeatById(id as string).then(setHeat);
      fetchCars().then(setCars);
    }
  }, [id]);

  async function handleDelete() {
    if (id && confirm("Delete this heat?")) {
      await deleteHeat(id as string);
      router.push("/heats");
    }
  }

  async function handleUpdate(entries: HeatEntry[]) {
    if (!id) return;
    const updated = await updateHeat(id as string, entries);
    setHeat(updated);
    setEditing(false);
  }

  if (!heat) return <Layout>Loading...</Layout>;

  if (editing) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-8">Edit Heat #{heat.id}</h1>
        <HeatForm onCreate={handleUpdate} lanes={heat.entries.length} />
        <button onClick={() => setEditing(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">Cancel</button>
      </Layout>
    );
  }

  if (reporting) {
    // Prepare lane info for report form
    const lanes = heat.entries.map(entry => {
      const car = cars.find(c => c.id === entry.carId);
      return {
        lane: entry.lane,
        carId: entry.carId,
        carName: car ? car.name : entry.carId,
        racerName: car?.racer ? car.racer.name : ""
      };
    });
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-8">Report Results for Heat #{Number(heat.id) + 1}</h1>
        <HeatReportForm
          lanes={lanes}
          onReport={async (results) => {
            try {
              setReportError(null);
              const updated = await reportHeat(heat.id!, results);
              setHeat(updated);
              setReporting(false);
            } catch {
              setReportError("Failed to report results");
            }
          }}
        />
        {reportError && <div className="text-red-600 mt-4">{reportError}</div>}
        <button onClick={() => setReporting(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">Cancel</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Heat #{Number(heat.id) + 1}</h1>
      <ul className="mb-8">
        {heat.entries.map((entry) => {
          const car = cars.find((c) => c.id === entry.carId);
          return (
            <li key={entry.lane} className="mb-2">
              <span className="font-semibold">Lane {entry.lane}:</span> {car ? car.name : entry.carId} {car?.racer ? `(${car.racer.name})` : ""}
              {typeof entry.result === "number" && (
                <span className="ml-2 text-blue-700">Result: {entry.result}s</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex space-x-4">
        <button onClick={() => setEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        <button onClick={() => setReporting(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Report Results</button>
      </div>
    </Layout>
  );
}
