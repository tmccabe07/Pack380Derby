"use client";

import Layout from "@/components/Layout";
import CarForm from "@/components/cars/CarForm";
import { createCar, Car } from "@/lib/api/cars";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

export default function CreateCarPage() {
  const router = useRouter();
  const { isAdmin, withAdmin } = useAdmin();

  async function handleCreateCar(car: Omit<Car, "id">) {
    try {
      await createCar(car);
      router.push(withAdmin("/cars"));
    } catch (error) {
      console.error(error);
      alert("Failed to create car");
    }
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-xl text-sm text-red-600 bg-red-50 border border-red-200 rounded p-4 mt-8">You are not authorized to register cars.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Register New Car</h1>
      <CarForm onSubmit={handleCreateCar} />
    </Layout>
  );
}
