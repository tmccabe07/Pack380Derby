"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import RacerList from "@/components/racers/RacerList";

export default function CarsPage() {

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">All Cars</h1>
      <Link href="/racers/create" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-6 inline-block" aria-label="Create Racer">
        Register New Racer
      </Link>

      <RacerList />
    </Layout>
  );
}
