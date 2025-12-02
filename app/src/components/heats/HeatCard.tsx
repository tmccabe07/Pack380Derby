
import Link from "next/link";

export default function HeatCard({ heat }: { heat: any }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-lg font-bold mb-4">Heat #{Number(heat.id) + 1}</h3>
      <ul className="text-sm mb-4">
        {heat.entries.map((entry: any) => (
          <li key={entry.id}>
            Lane {entry.lane}: {entry.carName} ({entry.racerName})
          </li>
        ))}
      </ul>
      <Link href={`/heats/${heat.id}`} className="text-blue-600 hover:underline">
        View Heat Details
      </Link>
    </div>
  );
}
