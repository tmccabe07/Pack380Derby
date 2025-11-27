import React from "react";
import { RaceType, fetchResultsByRank } from "@/lib/api/races";
import CarCell from "./CarCell";
import RacerCell from "./RacerCell";

interface LeaderboardEntry {
  carId: number;
  carName?: string;
  racerId?: number;
  racerName?: string;
  score: number;
}

interface LeaderboardProps {
  raceType: RaceType;
  rank: import("@/lib/api/racers").RankType;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ raceType, rank }) => {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetchResultsByRank(raceType, rank)
      .then((results) => {
      // Assume results is an array of { carId, carName, racerId, racerName, totalPlace }
      const leaderboardEntries: LeaderboardEntry[] = results
        .sort((a, b) => a.totalPlace - b.totalPlace)
        .map((result) => ({
          carId: result.carId,
          carName: result.carName,
          racerId: result.racerId,
          racerName: result.racerName,
          totalPlace: result.totalPlace, // or use another property if needed
        }));
      setEntries(leaderboardEntries);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [raceType, rank]);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!entries.length) return (
   <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">
        Leaderboard: {RaceType[raceType]} / {rank}
      </h2>
      <div>No results available.</div>
    </div>
  );

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">
        Leaderboard: {RaceType[raceType]} / {rank}
      </h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2 text-left">Place</th>
            <th className="py-2 px-2 text-left">Car</th>
            <th className="py-2 px-2 text-left">Racer</th>
            <th className="py-2 px-2 text-left">Score (lower is better)</th>
          </tr>
        </thead>
        <tbody>
            {entries.map((entry, idx) => {
            console.log("Leaderboard entry:", entry);
            return (
              <tr key={entry.carId} className="border-t">
              <td className="py-2 px-2">{idx + 1}</td>
              <CarCell carId={entry.carId} carName={entry.carName} />
              <RacerCell carId={entry.carId} />
              <td className="py-2 px-2">{entry.totalPlace}</td>
              </tr>
            );
            })}
        </tbody>
      </table>
    </div>
  );
};
