"use client";
import Layout from "@/components/Layout";
import { useEffect, useState, use } from "react";
import { fetchRaceById, Race, fetchHeatsForRace, HeatLane, RACE_TYPE_LABELS } from "@/lib/api/races";
import { RankType } from "@/lib/api/racers";

import HeatLanesTable from "@/components/heats/HeatLanesTable";
import Link from "next/link";

export default function RaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap promised route params (Next.js 15+ provides params as a Promise in client components)
  const { id } = use(params);
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const [flatHeats, setFlatHeats] = useState<Record<string, HeatLane[]>>({});
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
          const heatsByRank = await fetchHeatsForRace(Number(id));
          // Flatten all heats from all ranks into a single object by heatId
          const flat: Record<string, HeatLane[]> = {};
          Object.values(heatsByRank).forEach(heatsObj => {
            Object.entries(heatsObj).forEach(([heatId, lanes]) => {
              flat[heatId] = lanes;
            });
          });
          if (!cancelled) setFlatHeats(flat);
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

  if (loading) return <Layout>Loading...</Layout>;
  if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;
  if (!race) return <Layout>Race not found.</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Race #{race.id}</h1>
      <ul className="mb-8">
        <li>Type: {RACE_TYPE_LABELS[race.raceType] || race.raceType}</li>
        <li>Rank: {race.rank}</li>
      </ul>
      <HeatLanesTable
        groups={Object.entries(flatHeats)
          .filter(([_, arr]) => Array.isArray(arr))
          .map(([heatId, arr]) => ({
            heatId,
            entries: (arr as HeatLane[]).map(l => ({ ...l }))
          }))}
        raceId={id}
        showStatus
        emptyMessage="No heats for this race."
      />
    </Layout>
  );
}
