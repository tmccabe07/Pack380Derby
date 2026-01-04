"use client";

import Layout from "@/components/Layout";
import CarList from "@/components/cars/CarList";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { useState } from "react";

export default function CarsPage() {
  const [showRegistration, setShowRegistration] = useState(false);
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Registered Cars</h1>

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
      <CarList />
    </Layout>
  );
}
