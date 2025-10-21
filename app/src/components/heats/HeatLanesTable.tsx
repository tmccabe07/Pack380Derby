"use client";
import Link from "next/link";
import React from "react";
import { HeatEntry } from "@/lib/api/heats";

// Allow passing a superset (HeatLane) that has numeric carId; we'll normalize to string for display consistency.
type CompatibleHeatEntry = HeatEntry & { carId: string | number; };

export interface HeatLanesGroup {
  heatId: string | number;
  entries: CompatibleHeatEntry[];
}

interface HeatLanesTableProps {
  groups: HeatLanesGroup[]; // one or many heats
  raceId?: string | number;
  showStatus?: boolean;
  emptyMessage?: string;
  compact?: boolean;
}

function computeStatus(entries: CompatibleHeatEntry[]): "Upcoming" | "Completed" {
  const allWithResult = entries.length > 0 && entries.every(e => typeof e.result === "number" && e.result > 0);
  return allWithResult ? "Completed" : "Upcoming";
}

export default function HeatLanesTable({ groups, raceId, showStatus = true, emptyMessage = "No heats", compact = false }: HeatLanesTableProps) {
  if (!groups || groups.length === 0) {
    return <div className="text-gray-600 text-sm">{emptyMessage}</div>;
  }

  return (
    <div className={`overflow-x-auto ${compact ? '' : 'mb-8'}`}>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2 text-left">Heat</th>
            <th className="py-2 px-2 text-left">Lane</th>
            <th className="py-2 px-2 text-left">Car</th>
            <th className="py-2 px-2 text-left">Racer</th>
            <th className="py-2 px-2 text-left">Place</th>
            {showStatus && <th className="py-2 px-2 text-left">Status</th>}
          </tr>
        </thead>
        <tbody>
          {groups.map(group => {
            const status = computeStatus(group.entries);
            return group.entries.map((entry, idx) => (
              <tr key={`${group.heatId}-${idx}`} className="border-t">
                {idx === 0 && (
                  <td className="py-2 px-2 align-top" rowSpan={group.entries.length}>
                    <div className="flex flex-col gap-1">
                      <span>Heat {group.heatId}</span>
                      {raceId && (
                        <Link href={`/races/${raceId}/heats/${group.heatId}`} className="text-blue-600 hover:underline text-xs">View Heat</Link>
                      )}
                    </div>
                  </td>
                )}
                <td className="py-2 px-2">{entry.lane}</td>
                <td className="py-2 px-2">{entry.carId ? <Link href={`/cars/${entry.carId}`} className="text-blue-600 hover:underline">{entry.car?.name}</Link> : '—'}</td>
                <td className="py-2 px-2">{entry.car?.racer ? <Link href={`/racers/${entry.car?.racerId}`} className="text-green-600 hover:underline">{entry.car?.racer?.name}</Link> : '—'}</td>
                <td className="py-2 px-2">{entry.result ?? 0}</td>
                {showStatus && idx === 0 && (
                  <td className="py-2 px-2 align-top" rowSpan={group.entries.length}>{status}</td>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
