"use client";

import Layout from "@/components/Layout";
import DashboardCard from "@/components/DashboardCard";
import Link from "next/link";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Home() {
  const { data, loading, refreshing, error, lastUpdated } = useDashboardData();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

      <div className="flex items-center text-sm text-gray-500 mb-6">
        {refreshing ? (
          <span className="flex items-center">
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500 mr-2"></span>
            Updating...
          </span>
        ) : lastUpdated ? (
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        ) : (
          <span>Loading data...</span>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading dashboard...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DashboardCard title="Cars" count={data.cars} href="/cars" />
            <DashboardCard title="Racers" count={data.racers} href="/racers" />
          </div>

          <Link href="/racers/create">
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              Register New Racer
            </button>
          </Link>
        </>
      )}
    </Layout>
  );
}
