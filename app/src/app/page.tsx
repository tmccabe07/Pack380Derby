"use client";

import Layout from "@/components/Layout";
import DashboardCard from "@/components/DashboardCard";
import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Leaderboard } from "@/components/results/Leaderboard";
import { RaceType, RankType } from "@/lib/api/races";

export default function Home() {
  const { data, loading, refreshing, error, lastUpdated } = useDashboardData();

  const { isAdmin } = useAdmin();
  const [showRegistration, setShowRegistration] = useState(false);
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

          {/* Overall Leaderboard */}
          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} rank={RankType.Cub} />
          </div>

          {/* Sibling and Adult Leaderboards */}
          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} rank={RankType.Adult} />
          </div>

          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} rank={RankType.Sibling} />
          </div>

          {/* Den Leaderboard */}
          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} rank={RankType.Den} />
          </div>

          {isAdmin && (
            <button
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-4"
              onClick={() => setShowRegistration(true)}
            >
              Register Racer & Car
            </button>
          )}

          {showRegistration && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
              {/* Optional dim overlay behind content (remove if pure white desired) */}
              <button
                className="absolute top-3 right-4 text-3xl leading-none text-gray-500 hover:text-gray-700"
                onClick={() => setShowRegistration(false)}
                aria-label="Close registration"
              >
                &times;
              </button>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl w-full mx-auto">
                <RegistrationForm onRegistered={() => setShowRegistration(false)} />
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
