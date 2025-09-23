"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import HeatList from "@/components/heats/HeatList";
import { useAdmin } from "@/hooks/useAdmin";

export default function HeatsPage() {
  const { isAdmin, withAdmin } = useAdmin();
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">All Heats</h1>
      {isAdmin && (
        <Link href={withAdmin("/heats/create")} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-6 inline-block">
          Create New Heat
        </Link>
      )}
      <HeatList />
    </Layout>
  );
}
