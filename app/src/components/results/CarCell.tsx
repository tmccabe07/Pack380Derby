import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCarById } from "@/lib/api/cars";

interface CarCellProps {
  carId?: number;
  carName?: string;
}

const CarCell: React.FC<CarCellProps> = ({ carId, carName }) => {
  const [name, setName] = useState<string | undefined>(carName);

  useEffect(() => {
    if (!carName && carId) {
      fetchCarById(String(carId))
        .then(c => setName(c?.name || `Car #${carId}`))
        .catch(() => setName(`Car #${carId}`));
    } else {
      setName(carName);
    }
  }, [carId, carName]);

  return (
    <td className="py-2 px-2">
      {carId ? (
        <Link href={`/cars/${carId}`} className="text-blue-600 hover:underline">
          {name || `Car #${carId}`}
        </Link>
      ) : (
        <span className="text-gray-400">No Car</span>
      )}
    </td>
  );
};

export default CarCell;
