interface CarCardProps {
  car: Car;
  onlyImage?: boolean;
}

const IMAGE_DIMENSIONS = [640, 480].map(dim => dim * 0.5);
import Link from "next/link";
import Image from "next/image";
import { Car, getCarImage } from "@/lib/api/cars";
import { RankType } from "../../lib/api/racers";

export default function CarCard({ car, onlyImage = false }: CarCardProps) {
  const racer = car.racer;
  const isCub = racer?.rank === RankType.Cub;

  const details = (
    <div className="ml-4 text-sm text-gray-700">
      <span className="font-bold">Car #{car.id}</span>
      {racer?.name && <div><span className="font-medium"></span> {racer.name}</div>}
      {racer?.rank && <div><span className="font-medium"></span> {racer.rank}</div>}
      {isCub && racer?.den && <div><span className="font-medium"></span> {racer.den}</div>}
    </div>
  );

  return onlyImage ? (
    <div className="block hover:bg-gray-50 rounded transition">
      <div className="flex items-center gap-2 p-2">
        {car.image && (
          <Image
            src={getCarImage(car.image)}
            alt={car.name}
            width={IMAGE_DIMENSIONS[0] * 0.5}
            height={IMAGE_DIMENSIONS[1] * 0.5}
            className="object-cover rounded"
          />
        )}
        <span className="font-bold">Car #{car.id}</span>
      </div>
    </div>
  ) : (
    <Link href={`/cars/${car.id}`} className="block hover:bg-gray-50 rounded transition">
      <div className="flex items-center gap-2 p-2">
        {car.image && (
          <Image
            src={getCarImage(car.image)}
            alt={car.name}
            width={IMAGE_DIMENSIONS[0]}
            height={IMAGE_DIMENSIONS[1]}
            className="object-cover rounded"
          />
        )}
        <div className="text-lg font-semibold">{car.name}</div>
        {details}
      </div>
    </Link>
  );
}

