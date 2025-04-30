
import Link from "next/link";

export default function CarCard({ car }: { car: any }) {
  return (
    <div>
        <div className="text-lg font-semibold">{car.carName}</div>
        <div className="text-sm text-gray-600">Driven by: {car.name}</div>
    </div>
  );
}

