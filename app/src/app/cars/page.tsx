"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import CarList from "@/components/cars/CarList";
import { useAdmin } from "@/hooks/useAdmin";

export default function CarsPage() {
  const { isAdmin, withAdmin } = useAdmin();
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">All Cars</h1>
      {isAdmin && (
        <Link href={withAdmin("/cars/create")} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-6 inline-block">
          Register New Car
        </Link>
      )}
      <CarList />
    </Layout>
  );
}
