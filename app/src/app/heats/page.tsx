"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchHeats, Heat } from "@/lib/api/heats";
import HeatLanesTable from "@/components/heats/HeatLanesTable";
import { useAdmin } from "@/hooks/useAdmin";

export default function HeatsPage() {
  const { isAdmin, withAdmin } = useAdmin();
  const [heats, setHeats] = useState<Heat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchHeats();
        if (!cancelled) setHeats(data);
      } catch {
        if (!cancelled) setError("Failed to load heats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Determine upcoming heats safely: only consider objects with a valid entries array
  const hasEntries = (h: Heat): h is Heat & { entries: Heat['entries'] } => Array.isArray(h.entries) && h.entries.length > 0;
  const upcoming = heats
    .filter(hasEntries)
    .filter(h => h.entries.every(e => !e.result || e.result === 0));
  const groups = upcoming.map(h => ({ heatId: h.id ?? "?", entries: h.entries }));

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Upcoming Heats</h1>
      {isAdmin && (
        <Link href={withAdmin("/heats/create")} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-6 inline-block">
          Create New Heat
        </Link>
      )}
      {loading ? (
        <div className="text-gray-500">Loading heats...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <HeatLanesTable groups={groups} showStatus emptyMessage="No upcoming heats" />
      )}
    </Layout>
  );
}
