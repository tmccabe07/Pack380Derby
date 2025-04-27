
import Link from "next/link";

export default function RacerCard({ racer }: { racer: any }) {
  return (
    <div>
        <div className="text-lg font-semibold">{racer.name}</div>
    </div>
  );
}

