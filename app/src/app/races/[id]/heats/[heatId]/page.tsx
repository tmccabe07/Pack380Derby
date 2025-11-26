

"use client";

import { use } from 'react';
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { fetchHeatByRaceHeat, Heat } from "@/lib/api/heats";
// import { Car, fetchCars } from "@/lib/api/cars";
import HeatLanesTable from "@/components/heats/HeatLanesTable";

export default function HeatDetailsPage({ params }: { params: Promise<{ id: string; heatId: string }> }) {
  const { id, heatId } = use(params);
  const [heat, setHeat] = useState<Heat | null>(null);
  // const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    if (id && heatId) {
      fetchHeatByRaceHeat(id, heatId as string).then(setHeat);
      // fetchCars().then(setCars);
    }
  }, [id, heatId]);

  if (!heat) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <HeatLanesTable raceId={id} groups={[heat]} />
    </Layout>
  );
}
