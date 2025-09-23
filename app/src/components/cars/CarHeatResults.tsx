"use client";

import { Car } from "@/lib/api/cars";

interface CarHeatResults {
  car: Car;
}

export default function CarHeatResults({ car }: CarHeatResults) {
  // Placeholder fake data pattern just to visualize
  const dummyTimes = [3.21, 3.18, 3.25, 3.19, 3.17];
  const best = Math.min(...dummyTimes);

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Heat Results (Placeholder)</h3>
        <span className="text-xs text-gray-500">API Pending</span>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        {dummyTimes.map((t, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`text-xs font-medium ${t === best ? 'text-green-600' : 'text-gray-600'}`}>{t.toFixed(2)}s</div>
            <div className={`mt-1 h-10 w-3 rounded-sm ${t === best ? 'bg-green-500' : 'bg-gray-300'}`} style={{ height: `${(best / t) * 40}px` }} />
            <div className="text-[10px] text-gray-400 mt-1">H{i+1}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500">Showing sample data for car <span className="font-medium">{car.name}</span>. Real heat times will appear once the results API is integrated.</div>
    </div>
  );
}
