import { useState, useEffect, useCallback } from 'react';
import { BotData } from '../components/Dashboard/BotMatrix';

export interface BotTelemetryItem {
  id?: string;
  name: string;
  status: 'LIVE' | 'GATEWAY' | 'VETO';
  latency: number;
  memory: number;
  cpu?: number;
  route: 'DIRECT' | 'GATEWAY' | 'CIRCUIT BREAKER';
  lotRange?: string;
  riskPct?: string;
  whaleMin?: string;
  adxMin?: string;
  timeframe?: string;
}

export interface UseBotTelemetryResult {
  telemetry: Record<string, BotTelemetryItem>;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
}

export function useBotTelemetry(endpointUrl = '/api/bots/status'): UseBotTelemetryResult {
  const [telemetry, setTelemetry] = useState<Record<string, BotTelemetryItem>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      const response = await fetch(endpointUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Nu s-a putut citi starea boților`);
      }

      const data = await response.json();
      const items: BotTelemetryItem[] = Array.isArray(data) ? data : data.bots || [];

      const mapped: Record<string, BotTelemetryItem> = {};
      items.forEach(item => {
        const key = item.id || item.name.toLowerCase();
        mapped[key] = item;
      });

      setTelemetry(mapped);
      setIsConnected(true);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      // Graceful degradation: Python backend is in transition or dev mode
      const errorMsg = err instanceof Error ? err.message : 'Server Python offline';
      setError(errorMsg);
      setIsConnected(false);
      // Fallback baseline telemetry
      setTelemetry({
        alpha: { name: 'ALPHA', status: 'LIVE', latency: 11, memory: 142.8, cpu: 1.2, route: 'DIRECT' },
        beta: { name: 'BETA', status: 'LIVE', latency: 13, memory: 138.4, cpu: 0.9, route: 'DIRECT' },
        gamma: { name: 'GAMMA', status: 'LIVE', latency: 7, memory: 156.1, cpu: 2.1, route: 'DIRECT' },
        epsilon: { name: 'EPSILON', status: 'LIVE', latency: 12, memory: 145.0, cpu: 1.4, route: 'DIRECT' },
        sergiu: { name: 'SERGIU', status: 'LIVE', latency: 10, memory: 162.7, cpu: 1.8, route: 'DIRECT' },
        zeus: { name: 'ZEUS', status: 'GATEWAY', latency: 22, memory: 184.2, cpu: 0.6, route: 'GATEWAY' },
        ares: { name: 'ARES', status: 'GATEWAY', latency: 20, memory: 178.5, cpu: 0.8, route: 'GATEWAY' },
        hermes: { name: 'HERMES', status: 'GATEWAY', latency: 24, memory: 181.9, cpu: 0.7, route: 'GATEWAY' },
        chronos: { name: 'CHRONOS', status: 'VETO', latency: 5, memory: 92.4, cpu: 0.3, route: 'CIRCUIT BREAKER' },
        hades: { name: 'HADES', status: 'VETO', latency: 8, memory: 104.1, cpu: 0.4, route: 'CIRCUIT BREAKER' },
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
    }
  }, [endpointUrl]);

  useEffect(() => {
    // Initial fetch
    fetchTelemetry();

    // Polling every 5 seconds for live status
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  return {
    telemetry,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refresh: fetchTelemetry
  };
}
