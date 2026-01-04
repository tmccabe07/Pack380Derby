"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { fetchRaceById, fetchHeatsForRace, Race, HeatLane } from "@/lib/api/races";
// import { useParams } from "next/navigation";

export default function RacePrintPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap promised route params (Next.js 15+ provides params as a Promise in client components)
  const { id } = use(params);
  const [race, setRace] = useState<Race | null>(null);
  const [heatsByRank, setHeatsByRank] = useState<Record<string, Record<string, HeatLane[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetchRaceById(id);
        if (!r) {
          setRace(null);
          return;
        }
        if (!cancelled) setRace(r);
        try {
          const heats = await fetchHeatsForRace(Number(id));
          if (!cancelled) setHeatsByRank(heats);
        } catch {
          // ignore
        }
      } catch {
        if (!cancelled) setError("Failed to load race");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!race) return <div className="p-8 text-center">Race not found.</div>;

  return (
    <div className="print-bg-white print:text-black p-8" style={{ fontFamily: 'sans-serif' }}>
      <h1 className="text-3xl font-bold mb-4">Heats for Race #{race.id}</h1>
      {Object.entries(heatsByRank)
        .filter(([, heatsObj]) => Object.keys(heatsObj).length > 0)
        .map(([rank, heatsObj]) => (
          <div key={rank}>
            {Object.entries(heatsObj).map(([heatId, lanes]) => (
              <div
                key={heatId}
                className="mb-12"
                style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
              >
                <h3 className="text-xl font-bold mb-2">Heat {Number(heatId) + 1}</h3>
                <table
                  className="min-w-full border border-gray-400 mb-4"
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b border-gray-300">Lane</th>
                      <th className="py-2 px-4 border-b border-gray-300">Car ID</th>
                      <th className="py-2 px-4 border-b border-gray-300">Car Name</th>
                      <th className="py-2 px-4 border-b border-gray-300">Racer Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lanes.map((lane) => (
                      <tr key={lane.lane} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <td className="py-2 px-4 border-b border-gray-200">{lane.lane}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{lane.carId}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{lane.car?.name || ""}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{lane.car?.racer?.name || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
