"use client";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { fetchRaceById, Race } from "@/lib/api/races";
import Link from "next/link";

export default function RaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRaceById(id).then(setRace).catch(() => setError("Failed to load race")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout>Loading...</Layout>;
  if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;
  if (!race) return <Layout>Race not found.</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Race #{race.id}</h1>
      <ul className="mb-8">
        <li>Type: {race.raceType}</li>
        <li>Rank: {race.rank}</li>
        <li>Lanes: {race.numLanes}</li>
        <li>Group By Rank: {race.groupByRank ? "Yes" : "No"}</li>
      </ul>
      <Link href={`/heats?raceId=${race.id}`} className="text-blue-600 hover:underline">View Heats for this Race</Link>
    </Layout>
  );
}
