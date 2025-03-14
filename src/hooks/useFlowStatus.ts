
import { useState, useEffect, useCallback } from 'react';
import { API, FlowRun } from '@/services/api';

export function useFlowStatus(runIds: string[] = []) {
  const [flowRuns, setFlowRuns] = useState<FlowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlowRuns = useCallback(async () => {
    if (runIds.length === 0) {
      // If no specific runIds are provided, fetch all runs
      try {
        const runs = await API.getFlowRuns();
        setFlowRuns(runs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flow runs');
        setLoading(false);
      }
    } else {
      // Fetch specific runs by their IDs
      try {
        const runPromises = runIds.map(id => API.getFlowRun(id));
        const runs = await Promise.all(runPromises);
        setFlowRuns(runs.filter(Boolean) as FlowRun[]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flow runs');
        setLoading(false);
      }
    }
  }, [runIds]);

  useEffect(() => {
    fetchFlowRuns();
    
    // Set up polling for status updates
    const intervalId = setInterval(() => {
      fetchFlowRuns();
    }, 3000); // Poll every 3 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchFlowRuns]);

  return {
    flowRuns,
    loading,
    error,
    refetch: fetchFlowRuns
  };
}
