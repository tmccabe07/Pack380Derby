
import Link from "next/link";
import { memo } from "react";

interface RacerCardData {
  id?: string | number;
  name: string;
  rank: import("@/lib/api/racers").RankType;
  den: string;
}

interface RacerCardProps { racer: RacerCardData }

const rankColors: Record<string, { bg: string; text: string; label?: string }> = {
  lion: { bg: 'bg-amber-100', text: 'text-amber-800' },
  tiger: { bg: 'bg-orange-100', text: 'text-orange-800' },
  wolf: { bg: 'bg-blue-100', text: 'text-blue-800' },
  bear: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  webelos: { bg: 'bg-teal-100', text: 'text-teal-800' },
  aol: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Arrow of Light' },
  sibling: { bg: 'bg-pink-100', text: 'text-pink-800' },
  adult: { bg: 'bg-gray-200', text: 'text-gray-800' },
};

function RankBadge({ rank }: { rank: import("@/lib/api/racers").RankType }) {
  const cfg = rankColors[rank] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} shadow-sm border border-white/40`}
      title={cfg.label || rank}
    >
      {cfg.label || rank}
    </span>
  );
}

// Modern horizontal card layout
function RacerCardComponent({ racer }: RacerCardProps) {
  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full rounded-xl border border-gray-200/70 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow px-5 py-4">
      <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors">
            {racer.name}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2"><span className="font-medium text-gray-500">Rank:</span> <RankBadge rank={racer.rank} /></span>
            <span className="inline-flex items-center gap-1"><span className="font-medium text-gray-500">Den:</span> {racer.den}</span>
            {racer.id && (
              <span className="inline-flex items-center gap-1"><span className="font-medium text-gray-500">ID:</span> {racer.id}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={`/racers/${racer.id}`}
          className="inline-flex items-center rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
        >
          View
        </Link>
      </div>
    </div>
  );
}

const RacerCard = memo(RacerCardComponent);
export default RacerCard;

