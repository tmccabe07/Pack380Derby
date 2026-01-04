"use client";

import Layout from "@/components/Layout";
import DashboardCard from "@/components/DashboardCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Leaderboard } from "@/components/results/Leaderboard";
import { RaceType } from "@/lib/api/races";
import { RacerType } from "@/lib/api/racers";
import RacerLoginSelect from "@/components/racers/RacerLoginSelect";
import RacerDashboardDetails from "@/components/racers/RacerDashboardDetails";

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
            <RacerLoginSelect />
            <RacerDashboardDetails />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DashboardCard title="Cars" count={data.cars} href="/cars" />
            <DashboardCard title="Racers" count={data.racers} href="/racers" />
          </div>

          {/* Overall Leaderboard */}
          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} racerType={RacerType.CUB} />
            <Leaderboard raceType={RaceType.Semifinal} racerType={RacerType.CUB} />
            <Leaderboard raceType={RaceType.Final} racerType={RacerType.CUB} />
          </div>

          {/* Sibling and Adult Leaderboards */}

          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} racerType={RacerType.SIBLING} />
            <Leaderboard raceType={RaceType.Semifinal} racerType={RacerType.SIBLING} />
            <Leaderboard raceType={RaceType.Final} racerType={RacerType.SIBLING} />            
          </div>

          <div className="mb-8">
            <Leaderboard raceType={RaceType.Preliminary} racerType={RacerType.ADULT} />
            <Leaderboard raceType={RaceType.Semifinal} racerType={RacerType.ADULT} />
            <Leaderboard raceType={RaceType.Final} racerType={RacerType.ADULT} />
          </div>
          
          {/* Den Leaderboard */}


        </>
      )}
    </Layout>
  );
}
