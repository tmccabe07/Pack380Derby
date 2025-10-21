"use client";
import Layout from "@/components/Layout";
import { useEffect, useState, use } from "react";
import { fetchRaceById, Race, fetchHeatsForRace, HeatLane, RACE_TYPE_LABELS } from "@/lib/api/races";
import HeatLanesTable from "@/components/heats/HeatLanesTable";
import Link from "next/link";

// Group flat heat lane list into a record keyed by heatId
function groupHeatLanes(lanes: HeatLane[]): Record<string, HeatLane[]> {
  return lanes.reduce<Record<string, HeatLane[]>>((acc, lane) => {
    const key = String(lane.heatId ?? "unknown");
    if (!acc[key]) acc[key] = [];
    acc[key].push(lane);
    return acc;
  }, {});
}

export default function RaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap promised route params (Next.js 15+ provides params as a Promise in client components)
  const { id } = use(params);
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const [lanes, setLanes] = useState<HeatLane[]>([]);
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
          const heatLaneData = await fetchHeatsForRace(Number(id));
          if (!cancelled) setLanes(heatLaneData);
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
        <li>Lanes: {race.numLanes}</li>
        <li>Group By Rank: {race.groupByRank ? "Yes" : "No"}</li>
      </ul>
      <HeatLanesTable
        groups={Object.entries(groupHeatLanes(lanes)).map(([heatId, arr]) => ({
          heatId,
          entries: arr.map(l => ({ ...l }))
        }))}
        raceId={id}
        showStatus
        emptyMessage="No heats for this race."
      />
      <Link href={`/rounds`} className="text-blue-600 hover:underline">Back to Rounds</Link>
    </Layout>
  );
}
