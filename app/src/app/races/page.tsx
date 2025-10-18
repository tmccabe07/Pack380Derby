"use client";
import Layout from "@/components/Layout";
import Link from "next/link";
import RaceSummaryList from "@/components/races/RaceSummaryList";
import { useAdmin } from "@/hooks/useAdmin";

export default function RacesPage() {
  const { isAdmin, withAdmin } = useAdmin();
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">All Races</h1>
      {isAdmin && (
        <Link href={withAdmin("/races/create")} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-6 inline-block">
          Create New Race
        </Link>
      )}
  <RaceSummaryList />
    </Layout>
  );
}
