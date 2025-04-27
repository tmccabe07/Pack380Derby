import { fetchDashboardCounts } from "@/lib/api/dashboard";
import { useEffect, useState } from "react";

interface DashboardData {
  cars: number;
  racers: number;
}

export function useDashboardData(pollingIntervalMs = 5000) {
  const [data, setData] = useState<DashboardData>({ cars: 0, racers: 0 });
  const [loading, setLoading] = useState<boolean>(true); // Initial page load
  const [refreshing, setRefreshing] = useState<boolean>(false); // Background refresh
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadDashboardData(isBackground = false) {
    try {
      if (isBackground) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await fetchDashboardCounts();
      setData(data);

      setLastUpdated(new Date());
      setError(null);
      
    } catch (err) {
      console.error(err);
      setError('Unable to load dashboard data');
    } finally {
      if (isBackground) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadDashboardData(); // Initial load

    const interval = setInterval(() => {
      loadDashboardData(true); // Background refresh
    }, pollingIntervalMs);

    return () => clearInterval(interval);
  }, [pollingIntervalMs]);

  return { data, loading, refreshing, error, lastUpdated };
}
