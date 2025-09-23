
import Link from "next/link";

export default function RacerCard({ racer }: { racer: any }) {
  return (
    <div className="p-4 border rounded shadow">
    <div className="text-lg font-semibold">{racer.name}</div>
    <div className="text-sm text-gray-600">Rank: {racer.rank}</div>
    <div className="text-sm text-gray-600">Den: {racer.den}</div>
    <Link href={`/racers/${racer.id}`}>
      View
    </Link> | 
    <Link href={`/racers/${racer.id}/edit`}>
      Edit
    </Link>
  </div>
  );
}

