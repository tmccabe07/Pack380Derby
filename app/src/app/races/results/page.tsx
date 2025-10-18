"use client";
import Layout from "@/components/Layout";
import ResultsForm from "@/components/races/ResultsForm";

export default function RaceResultsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-3xl font-bold">Calculate Race Results</h1>
        <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
          <ResultsForm />
        </div>
      </div>
    </Layout>
  );
}
