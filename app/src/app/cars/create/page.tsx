"use client";
import Layout from "@/components/Layout";
import CarForm from "@/components/cars/CarForm";
import { createCar, Car } from "@/lib/api/cars";
import { useRouter } from "next/navigation";

export default function CreateCarPage() {
  const router = useRouter();

  async function handleCreateCar(car: Omit<Car, "id">) {
    try {
      await createCar(car);
      router.push("/cars");
    } catch (error) {
      console.error(error);
      alert("Failed to create car");
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Register New Car</h1>
      <CarForm onSubmit={handleCreateCar} />
    </Layout>
  );
}
