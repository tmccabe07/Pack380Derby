interface CarCardProps {
  car: Car;
  disableLink?: boolean;
}

import Link from "next/link";
import Image from "next/image";
import { Car, getCarImage } from "@/lib/api/cars";

export default function CarCard({ car, disableLink = false }: CarCardProps) {

  return disableLink ? (
    <div className="block hover:bg-gray-50 rounded transition">
      <div className="flex items-center gap-2 p-2">
        {car.image && (
          <Image
            src={getCarImage(car.image)}
            alt={car.name}
            width={80}
            height={50}
            className="w-20 h-12 object-cover rounded"
          />
        )}
        <div className="text-lg font-semibold">{car.name}</div>
      </div>
    </div>
  ) : (
    <Link href={`/cars/${car.id}`} className="block hover:bg-gray-50 rounded transition">
      <div className="flex items-center gap-2 p-2">
        {car.image && (
          <Image
            src={getCarImage(car.image)}
            alt={car.name}
            width={80}
            height={50}
            className="w-20 h-12 object-cover rounded"
          />
        )}
        <div className="text-lg font-semibold">{car.name}</div>
      </div>
    </Link>
  );
}

