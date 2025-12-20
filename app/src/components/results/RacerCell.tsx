import React from "react";
import Link from "next/link";

interface RacerCellProps {
  racerId?: number;
  racerName?: string;
  racerDen?: string;
  racerRank?: string;
  carId?: number;
}

import { useEffect, useState } from "react";
import { fetchRacerById } from "@/lib/api/racers";
import { fetchCarById } from "@/lib/api/cars";

const RacerCell: React.FC<RacerCellProps> = ({ racerId, racerName, racerRank, racerDen, carId }) => {
  const [name, setName] = useState<string | undefined>(racerName);
  const [den, setDen] = useState<string | undefined>(racerDen);
  const [rank, setRank] = useState<string | undefined>(racerRank);
  const [id, setId] = useState<number | undefined>(racerId);

  useEffect(() => {
    if (!racerName && !racerId && carId) {
      // Fetch car, then fetch racer by car.racerId
      fetchCarById(String(carId))
        .then(car => {
          if (car?.racerId) {
            setId(Number(car.racerId));
            return fetchRacerById(String(car.racerId));
          }
          throw new Error("No racerId for car");
        })
        .then(r => {
          setName(r?.name || `Racer #${String(r?.id ?? racerId ?? carId)}`);
          setDen(r?.den);
          setRank(r?.rank);
        })
        .catch(() => setName("Unknown Racer"));
    } else if (!racerName && racerId) {
      fetchRacerById(String(racerId))
        .then(r => {
          setName(r?.name || `Racer #${racerId}`);
          setDen(r?.den);
          setRank(r?.rank);
        })
        .catch(() => {
          setName(`Racer #${racerId}`);
          setDen(undefined);
        });
    } else {
      setName(racerName);
      setId(racerId);
    }
  // Only update when input props change, not internal id
  }, [racerId, racerName, racerDen, carId]);

  return (
    <td className="py-2 px-2">
      {id ? (
        <span>
          <Link href={`/racers/${id}`} className="text-green-600 hover:underline">
            {name || `Racer #${id}`}
          </Link>
          {den && (
            <span className="ml-2 text-xs text-gray-500">({rank} {den})</span>
          )}
        </span>
      ) : (
        <span className="text-gray-400">No Racer</span>
      )}
    </td>
  );
};

export default RacerCell;
