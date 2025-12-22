"use client";
import Layout from "@/components/Layout";
import CompetitionConfig from "@/components/competition/CompetitionConfig";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function CompetitionPage() {
  const { data, loading, refreshing, error, lastUpdated } = useDashboardData();

  const { isAdmin } = useAdmin();
  const [showRegistration, setShowRegistration] = useState(false);
  return (
    <Layout>
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
        </>
      )}
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
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-3xl font-bold">Competition Management</h1>
        <CompetitionConfig />
      </div>
    </Layout>
  );
}
