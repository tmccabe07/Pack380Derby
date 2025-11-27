"use client";
import Layout from "@/components/Layout";
import CompetitionConfig from "@/components/competition/CompetitionConfig";

export default function CompetitionPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-3xl font-bold">Competition Management</h1>
        <CompetitionConfig />
      </div>
    </Layout>
  );
}
