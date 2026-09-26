import { useState, useEffect, useRef, useCallback } from 'react';

export interface LogEntry {
  id: string;
  rawText: string;
  timestamp: string;
  category: 'buy' | 'sell_error' | 'veto_wait' | 'neutral';
  formattedText: string;
}

export interface UseLiveLogsOptions {
  wsUrl?: string;
  apiPollUrl?: string;
  maxLogs?: number;
  enableDevFallback?: boolean;
}

const TEMPLATE_LOGS = [
  "[alpha-sniper] INFO - Whale detectat pe XAUUSD M15: 1.84x (min 1.80x), ADX=37.2, Scor=88.5",
  "[alpha-sniper] INFO - BUY 0.25 lot XAUUSD @ 2654.82 | TP: 2662.50 | SL: 2650.10",
  "[alpha-sniper] INFO - ADX insuficient: M15=49.4 M30=18.0 (min 35.0)",
  "[beta-trend] INFO - Istoric M30: 500 bare încărcate din cTrader Open API",
  "[beta-trend] INFO - Așteptăm pullback la EMA20 (2652.10 vs current 2654.30)",
  "[beta-trend] INFO - Whale trend volume 1.55x confirmat pe pullback EMA50, semnal valid",
  "[beta-trend] INFO - BUY 0.35 lot XAUUSD @ 2653.40 (Trailing Stop activat)",
  "[gamma-scalp] INFO - Whale scalper M1 ratio 1.34x depășit, TP țintă +5 pips",
  "[gamma-scalp] INFO - BUY 0.15 lot XAUUSD @ 2654.10 scalp execution",
  "[gamma-scalp] INFO - Take profit atins: +4.8 pips ($72.00 realizat)",
  "[epsilon-liquidity] INFO - Sweep detectat la 2648.50, volum 1.45x, testare absorbție",
  "[epsilon-liquidity] INFO - BUY 0.30 lot XAUUSD pe liquidity sweep reversal",
  "[sergiu-flagship] INFO - Așteptăm deschiderea London Fixing pentru validare ORB",
  "[sergiu-flagship] INFO - Whale session flow > 1.62x la deschiderea NY, ORB 15m breakout confirmat",
  "[sergiu-flagship] INFO - BUY 0.75 lot XAUUSD @ 2656.20 (Flagship Core Order)",
  "[chronos-sentinel] INFO - VETO activ: 22:00 RO Rollover spread protection window armat",
  "[chronos-sentinel] INFO - LBMA Fixing window monitor: spread normal 1.8 pips, VETO standby",
  "[hades-sentinel] INFO - Verificare COT: Managed Money net long 62.4% (sub pragul de VETO 90%)",
  "[hades-sentinel] INFO - Așteptăm raport CFTC COT actualizat pentru vineri seara",
  "[hermes-gateway] INFO - Istoric US Core CPI T+15m: Z-Score = +0.42 (filtrare noise completă)",
  "[hermes-gateway] INFO - BUY semnal Z-Score deviation favorabil aurului după stabilizare",
  "[ares-shock] INFO - M15 ATR actual: 1.15x (Ares prag shock 2.5x neîndeplinit)",
  "[ares-shock] INFO - Alertă volatilitate: spike 2.65x ATR neprogramat detectat",
  "[ares-shock] INFO - SELL hedging rapid 0.20 lot contra impuls epuizat",
  "[zeus-macro] INFO - DXY 100.82 (-0.35%), TIPS yield 1.98%, corelație favorabilă gold",
  "[gateway_service] WARNING - Eroare temporară handshake socket cTrader FIX, reconnecting in 200ms",
  "[gateway_service] INFO - cTrader FIX session RESTORED (Ping: 12.4ms)",
  "[alpha-sniper] INFO - SELL anulat: semnal opus trendului macro D1",
  "[next-gen/shared] INFO - Verificare context_db: 10/10 boți sincronizați pe PM2"
];

export const categorizeLog = (text: string): { category: LogEntry['category']; formattedText: string } => {
  if (text.includes("Whale") || text.includes("BUY")) {
    return {
      category: 'buy',
      formattedText: text.startsWith('✅') ? text : `✅ ${text}`
    };
  }
  if (text.includes("SELL") || text.includes("Eroare")) {
    return {
      category: 'sell_error',
      formattedText: text.startsWith('❌') ? text : `❌ ${text}`
    };
  }
  if (text.includes("VETO") || text.includes("Așteptăm")) {
    return {
      category: 'veto_wait',
      formattedText: text.startsWith('⏳') ? text : `⏳ ${text}`
    };
  }
  return {
    category: 'neutral',
    formattedText: text
  };
};

export const getLogTimestamp = (): string => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${date} ${hours}:${minutes}:${seconds},${ms}`;
};

export function useLiveLogs(options: UseLiveLogsOptions = {}) {
  const {
    wsUrl = 'ws://localhost:5000/logs',
    apiPollUrl = '/api/logs',
    maxLogs = 50,
    enableDevFallback = true
  } = options;

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const pausedRef = useRef<boolean>(isPaused);
  pausedRef.current = isPaused;

  const appendLog = useCallback((rawMessage: string) => {
    if (pausedRef.current) return;

    const { category, formattedText } = categorizeLog(rawMessage);
    const newEntry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rawText: rawMessage,
      timestamp: getLogTimestamp(),
      category,
      formattedText
    };

    setLogs(prev => {
      const updated = [...prev, newEntry];
      return updated.length > maxLogs ? updated.slice(updated.length - maxLogs) : updated;
    });
  }, [maxLogs]);

  // Initial seed logs
  useEffect(() => {
    const initialSeed = [
      categorizeLog("[trinity-init] 2026-09-25 18:00:01,102 - INFO - Trinity Fund Quant Engine PM2 cluster boot"),
      categorizeLog("[trinity-init] 2026-09-25 18:00:01,894 - INFO - cTrader Open API Protocol v2 connection established"),
      categorizeLog("[chronos-sentinel] 2026-09-25 18:00:02,410 - INFO - Chronos Time Guardian initialized (VETO window armed)"),
      categorizeLog("[alpha-sniper] 2026-09-25 18:00:03,115 - INFO - Istoric M30: 500 bare încărcate din cTrader Open API"),
      categorizeLog("[beta-trend] 2026-09-25 18:00:03,991 - INFO - Așteptăm pullback la EMA20 (2652.10 vs current 2654.30)"),
      categorizeLog("[alpha-sniper] 2026-09-25 18:00:04,502 - INFO - Whale detectat pe XAUUSD M15: 1.84x (min 1.80x), ADX=37.2, Scor=88.5"),
      categorizeLog("[alpha-sniper] 2026-09-25 18:00:05,210 - INFO - BUY 0.25 lot XAUUSD @ 2654.82 | TP: 2662.50 | SL: 2650.10"),
    ].map((item, idx) => ({
      id: `seed-${idx}`,
      rawText: item.formattedText,
      timestamp: getLogTimestamp(),
      category: item.category,
      formattedText: item.formattedText
    }));

    setLogs(initialSeed);
  }, []);

  // WebSocket attempt with automatic fallback
  useEffect(() => {
    let isMounted = true;
    let fallbackInterval: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setError(null);
          appendLog(`[trinity-feed] INFO - Conectat la stream live Python WebSocket (${wsUrl})`);
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            const line = data.message || data.log || event.data;
            appendLog(line);
          } catch {
            appendLog(String(event.data));
          }
        };

        socket.onerror = () => {
          if (!isMounted) return;
          setIsConnected(false);
          setError(`Nu s-a putut stabili conexiunea WebSocket cu ${wsUrl}`);
        };

        socket.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          // Try reconnecting in 5 seconds
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };
      } catch {
        if (!isMounted) return;
        setIsConnected(false);
        setError(`Eroare de instanțiere WebSocket pentru ${wsUrl}`);
      }
    };

    connectWebSocket();

    // Dev Fallback Simulation: if real backend isn't connected, stream structured dev logs directly
    if (enableDevFallback) {
      const scheduleNextDevLog = () => {
        const randomDelay = Math.floor(Math.random() * 1500) + 1800; // 1.8s - 3.3s
        fallbackInterval = setTimeout(() => {
          if (!isMounted) return;
          // If real websocket is not open, feed formatted quant stream directly
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            const randomMsg = TEMPLATE_LOGS[Math.floor(Math.random() * TEMPLATE_LOGS.length)];
            appendLog(`${getLogTimestamp()} - ${randomMsg}`);
          }
          scheduleNextDevLog();
        }, randomDelay);
      };

      scheduleNextDevLog();
    }

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (fallbackInterval) clearTimeout(fallbackInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [wsUrl, apiPollUrl, enableDevFallback, appendLog]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const clearLogs = useCallback(() => setLogs([]), []);

  return {
    logs,
    isConnected,
    error,
    isPaused,
    pause,
    resume,
    clearLogs
  };
}
