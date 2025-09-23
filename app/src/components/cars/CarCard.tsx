import Link from "next/link";
import Image from "next/image";
import { Car } from "@/lib/api/cars";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.id}`} className="block hover:bg-gray-50 rounded transition">
      <div>
        <div className="text-lg font-semibold">{car.name}</div>
        <div className="text-sm text-gray-600">
          Driven by: {car.racer?.name || "Unknown"}
        </div>
        <div className="text-sm">Year: {car.year}</div>
        <div className="text-sm">Weight: {car.weight}</div>
        <div className="text-sm">ID: {car.id}</div>
        <div className="text-sm">Racer ID: {car.racerId}</div>
        {car.image && (
          <div className="mt-2">
            <Image src={car.image} alt={car.name} width={128} height={80} className="w-32 h-20 object-cover rounded" />
          </div>
        )}
      </div>
    </Link>
  );
}

