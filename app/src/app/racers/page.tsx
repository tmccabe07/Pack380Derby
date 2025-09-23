"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import RacerList from "@/components/racers/RacerList";
import { useAdmin } from "@/hooks/useAdmin";

export default function RacersPage() {
  const { isAdmin, withAdmin } = useAdmin();
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">All Racers</h1>
      {isAdmin && (
        <Link href={withAdmin("/racers/create")} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-6 inline-block" aria-label="Create Racer">
          Register New Racer
        </Link>
      )}
      <RacerList />
    </Layout>
  );
}
