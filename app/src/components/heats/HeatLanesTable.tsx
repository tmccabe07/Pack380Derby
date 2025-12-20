"use client";
import Link from "next/link";
import React, { useState } from "react";
import { HeatEntry, updateHeat } from "@/lib/api/heats";
import { useAdmin } from "@/hooks/useAdmin";

// Allow passing a superset (HeatLane) that has numeric carId; we'll normalize to string for display consistency.
type CompatibleHeatEntry = HeatEntry & { carId: string | number; };

export interface HeatLanesGroup {
  heatId: string | number;
  entries: CompatibleHeatEntry[];
}

interface HeatLanesTableProps {
  groups: HeatLanesGroup[]; // one or many heats
  raceId?: string | number;
  emptyMessage?: string;
  compact?: boolean;
}

function computeStatus(entries: CompatibleHeatEntry[]): "Upcoming" | "Completed" {
  const allWithResult = entries.length > 0 && entries.every(e => typeof e.result === "number" && e.result > 0);
  return allWithResult ? "Completed" : "Upcoming";
}

const HeatLanesTable: React.FC<HeatLanesTableProps> = ({
  groups,
  raceId,
  emptyMessage,
  compact,
}) => {
  const { isAdmin, withAdmin } = useAdmin();
  const [editResults, setEditResults] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  // savedState: 'false' | 'true' | 'failure'
  const [savedState, setSavedState] = useState<{ [key: string]: 'false' | 'true' | 'failure' }>({});
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [localGroups, setLocalGroups] = useState(groups);
  // const [heatId, setHeatId] = useState<string | number>(groups.length === 1 ? groups[0].heatId : '');

  // Keep localGroups in sync if groups prop changes
  React.useEffect(() => {
    setLocalGroups(groups);
    // On load, set all to saved-false
    const initialState: { [key: string]: 'false' } = {};
    groups.forEach(g => {
      initialState[`${g.heatId}`] = 'false';
    });
    setSavedState(initialState);
    // setHeatId(groups.length === 1 ? groups[0].heatId : '');
  }, [groups]);

  if (!localGroups || localGroups.length === 0) {
    return <div className="text-gray-600 text-sm">{emptyMessage}</div>;
  }

  function validatePlaces(heatId: string | number, entries: CompatibleHeatEntry[], live = false, blurIdx?: number) {
    setSavedState(s => ({ ...s, [`${heatId}`]: 'false' }));
    const numLanes = entries.length;
    const values = entries.map((e, idx) => editResults[`${heatId}-${idx}`] ?? e.result ?? '');
    let valid = true;
    const errors: { [key: string]: string } = { ...fieldErrors };
    const seen = new Set<number>();
    for (let i = 0; i < values.length; i++) {
      const val = Number(values[i]);
      if (!val || val < 1 || val > numLanes) {
        if (live || blurIdx === i) errors[`${heatId}-${i}`] = `Place must be 1-${numLanes}`;
        valid = false;
      } else if (seen.has(val)) {
        if (live || blurIdx === i) errors[`${heatId}-${i}`] = `Duplicate place`;
        valid = false;
      } else {
        if (live || blurIdx === i) delete errors[`${heatId}-${i}`];
        seen.add(val);
      }
    }
    setFieldErrors(errors);
    // Ensure saved state is set after update
  setTimeout(() => setSavedState(s => ({ ...s, [`${heatId}`]: 'false' })), 0);

    return valid;
  }

  async function handleSaveAll(heatId: string | number, entries: CompatibleHeatEntry[]) {
    setError(null);
    if (!validatePlaces(heatId, entries)) {
      setError("Please fix errors before saving.");
      setSavedState(s => ({ ...s, [`${heatId}`]: 'failure' }));
      return;
    }
    setSaving(s => ({ ...s, [`${heatId}`]: true }));
    try {
      const updatedEntries = entries.map((e, idx) => ({ ...e, result: editResults[`${heatId}-${idx}`] ?? e.result }));
      await updateHeat(String(heatId), updatedEntries);
      setLocalGroups(prevGroups => prevGroups.map(g =>
        g.heatId === heatId
          ? { ...g, entries: g.entries.map((e, idx) => ({ ...e, result: updatedEntries[idx].result })) }
          : g
      ));
      setEditResults(r => {
        const copy = { ...r };
        for (let i = 0; i < entries.length; i++) delete copy[`${heatId}-${i}`];
        return copy;
      });
      setFieldErrors({});
      setSavedState(s => ({ ...s, [`${heatId}`]: 'true' }));
    } catch {
      setError("Failed to save result");
      setSavedState(s => ({ ...s, [`${heatId}`]: 'failure' }));
    } finally {
      setSaving(s => ({ ...s, [`${heatId}`]: false }));
    }
  }

  return (
    <div className={`overflow-x-auto ${compact ? '' : 'mb-8'}`}>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2 text-left">Heat</th>
            <th className="py-2 px-2 text-left">Lane</th>
            <th className="py-2 px-2 text-left">Place</th>
            <th className="py-2 px-2 text-left">Car #</th>
            <th className="py-2 px-2 text-left">Car Name</th>
            <th className="py-2 px-2 text-left">Racer Name</th>
            <th className="py-2 px-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {localGroups.map(group => {
            const status = computeStatus(group.entries);
            return group.entries.map((entry, idx) => (
              <tr key={`${group.heatId}-${idx}`} className="border-t">
                {idx === 0 && (
                  <td className="py-2 px-2 align-top" rowSpan={group.entries.length}>
                    <div className="flex flex-col gap-1">
                      <span>Heat {Number(group.heatId) + 1}</span>
                      {raceId && (
                        <div className="flex flex-col gap-1">
                          <Link href={withAdmin(`/races/${raceId}/heats/${group.heatId}`)} className="text-blue-600 hover:underline text-xs">View Heat</Link>
                          <Link href={withAdmin(`/races/${raceId}`)} className="text-blue-600 hover:underline text-xs">View Race</Link>
                        </div>
                      )}
                    </div>
                  </td>
                )}
                <td className="py-2 px-2">{entry.lane}</td>
                <td className="py-2 px-2">
                  {isAdmin ? (
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min={1}
                        max={group.entries.length}
                        value={editResults[`${group.heatId}-${idx}`] ?? entry.result ?? ''}
                        onChange={e => {
                          setEditResults(r => {
                            const next = { ...r, [`${group.heatId}-${idx}`]: Number(e.target.value) };
                            validatePlaces(group.heatId, group.entries, true);
                            return next;
                          });
                        }}
                        onBlur={() => {
                          validatePlaces(group.heatId, group.entries, false, idx);
                        }}
                        className={`border p-1 w-14 text-center ${fieldErrors[`${group.heatId}-${idx}`] ? 'border-red-500' : ''}`}
                        tabIndex={idx + 1}
                        disabled={saving[`${group.heatId}`]}
                        aria-invalid={!!fieldErrors[`${group.heatId}-${idx}`]}
                        aria-describedby={fieldErrors[`${group.heatId}-${idx}`] ? `error-${group.heatId}-${idx}` : undefined}
                      />
                      {fieldErrors[`${group.heatId}-${idx}`] && (
                        <span id={`error-${group.heatId}-${idx}`} className="text-xs text-red-600 mt-1">{fieldErrors[`${group.heatId}-${idx}`]}</span>
                      )}
                    </div>
                  ) : (
                    entry.result ?? 0
                  )}
                </td>
                <td className="py-2 px-2">{entry.carId ? <Link href={`/cars/${entry.carId}`} className="text-blue-600 hover:underline">{entry.carId}</Link> : '—'}</td>
                <td className="py-2 px-2">{entry.carId ? <Link href={`/cars/${entry.carId}`} className="text-blue-600 hover:underline">{entry.car?.name}</Link> : '—'}</td>
                <td className="py-2 px-2">{entry.car?.racer ? <Link href={`/racers/${entry.car?.racerId}`} className="text-green-600 hover:underline">{entry.car?.racer?.name}</Link> : '—'}</td>
                {idx === 0 && (
                  <td className="py-2 px-2 align-top" rowSpan={group.entries.length}>{status}</td>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
      {isAdmin && (
        <div className="mt-4 flex justify-end">
          {localGroups.map(group => {
            // Disable if any error for this group
            const hasError = group.entries.some((_, idx) => fieldErrors[`${group.heatId}-${idx}`]);
            return (
              <button
                key={group.heatId}
                onClick={() => handleSaveAll(group.heatId, group.entries)}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2${hasError ? ' opacity-50 cursor-not-allowed' : ''} saved-${savedState[`${group.heatId}`] || 'false'}`}
                disabled={saving[`${group.heatId}`] || hasError}
              >
                {saving[`${group.heatId}`] ? 'Saving...' : savedState[`${group.heatId}`] === 'true' ? 'Saved' : savedState[`${group.heatId}`] === 'failure' ? 'Save Failed' : 'Save Heat'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeatLanesTable;
