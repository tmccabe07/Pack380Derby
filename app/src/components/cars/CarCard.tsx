import Link from "next/link";
import Image from "next/image";
import { Car, getCarImage } from "@/lib/api/cars";

export default function CarCard({ car }: { car: Car }) {

  return (
    <Link href={`/cars/${car.id}`} className="block hover:bg-gray-50 rounded transition">
      <div className="flex items-center gap-4 p-2">
        {car.image && (
          <Image
            src={getCarImage(car.image)}
            alt={car.name}
            width={80}
            height={50}
            className="w-20 h-12 object-cover rounded"
          />
        )}
        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">{car.name}</div>
          <div className="flex flex-row flex-wrap gap-4 text-sm text-gray-700">
            <span>Driven by: {car.racer?.name || "Unknown"}</span>
            <span>Year: {car.year}</span>
            <span>Weight: {car.weight}</span>
            <span>ID: {car.id}</span>
            <span>Racer ID: {car.racerId}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

