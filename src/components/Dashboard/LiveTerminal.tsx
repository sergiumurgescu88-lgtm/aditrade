import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Pause, 
  Trash2, 
  ArrowDown, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Filter
} from 'lucide-react';

interface LogEntry {
  id: string;
  rawText: string;
  timestamp: string;
  category: 'buy' | 'sell_error' | 'veto_wait' | 'neutral';
  formattedText: string;
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

export const LiveTerminal: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell_error' | 'veto'>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef<boolean>(false);

  // Helper to format timestamps like Python logging: 2026-09-25 18:02:16,637
  const getLogTimestamp = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${date} ${hours}:${minutes}:${seconds},${ms}`;
  };

  // Helper for syntax categorization
  const categorizeLog = (text: string): { category: LogEntry['category']; formattedText: string } => {
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

  // Initial seed of logs
  useEffect(() => {
    const initialSeed: LogEntry[] = [
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

  // Interval simulator: generates new log every 1.5 - 3.0 seconds
  useEffect(() => {
    if (isPaused) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextLog = () => {
      const randomInterval = Math.floor(Math.random() * 1500) + 1500; // 1500ms to 3000ms

      timeoutId = setTimeout(() => {
        const randomTemplate = TEMPLATE_LOGS[Math.floor(Math.random() * TEMPLATE_LOGS.length)];
        const timestamp = getLogTimestamp();
        const fullMessage = `${timestamp} - ${randomTemplate}`;
        const { category, formattedText } = categorizeLog(fullMessage);

        const newEntry: LogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          rawText: fullMessage,
          timestamp,
          category,
          formattedText
        };

        setLogs(prev => {
          // Limit to last 50 lines strictly
          const updated = [...prev, newEntry];
          if (updated.length > 50) {
            return updated.slice(updated.length - 50);
          }
          return updated;
        });

        scheduleNextLog();
      }, randomInterval);
    };

    scheduleNextLog();

    return () => clearTimeout(timeoutId);
  }, [isPaused]);

  // Handle auto-scroll logic
  useEffect(() => {
    if (autoScroll && terminalRef.current && !userScrolledRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Detect user scroll
  const handleScroll = () => {
    if (!terminalRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 25;

    if (isAtBottom) {
      userScrolledRef.current = false;
      if (!autoScroll) setAutoScroll(true);
    } else {
      userScrolledRef.current = true;
      if (autoScroll) setAutoScroll(false);
    }
  };

  const scrollToBottom = () => {
    userScrolledRef.current = false;
    setAutoScroll(true);
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const copyTerminalOutput = () => {
    const textToCopy = logs.map(l => l.formattedText).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter logs if needed
  const filteredLogs = logs.filter(log => {
    if (filterType === 'all') return true;
    if (filterType === 'buy') return log.category === 'buy';
    if (filterType === 'sell_error') return log.category === 'sell_error';
    if (filterType === 'veto') return log.category === 'veto_wait';
    return true;
  });

  return (
    <div className={`flex flex-col transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-4 z-50 bg-[#000000] border border-[#66FCF1]/40 rounded-xl shadow-2xl p-4' 
        : 'bg-[#000000] rounded-xl border border-slate-800 shadow-2xl overflow-hidden'
    }`}>
      {/* Terminal Titlebar */}
      <div className="h-11 bg-[#090b10] border-b border-slate-800 px-4 flex items-center justify-between select-none">
        {/* Left: Window Controls & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#EF4444]/80 border border-[#EF4444]" />
            <span className="h-3 w-3 rounded-full bg-[#F59E0B]/80 border border-[#F59E0B]" />
            <span className="h-3 w-3 rounded-full bg-[#10B981]/80 border border-[#10B981]" />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <TerminalIcon className="w-3.5 h-3.5 text-[#66FCF1]" />
            <span className="text-xs font-mono font-bold text-[#E2E8F0]">
              pm2 logs trinity-fleet --raw
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-[#94A3B8] border border-slate-700">
              buffer: {logs.length}/50
            </span>
          </div>
        </div>

        {/* Right: Controls (Pause, Auto-Scroll, Filter, Copy, Clear, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Stream Status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800 bg-[#0B0C10]">
            <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-[#F59E0B]' : 'bg-[#10B981] animate-ping'}`} />
            <span className={isPaused ? 'text-[#F59E0B]' : 'text-[#10B981]'}>
              {isPaused ? 'STREAM PAUSED' : 'LIVE TAIL'}
            </span>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded text-xs font-mono transition-colors ${
              isPaused 
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/30' 
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
            title={isPaused ? 'Resume live log stream' : 'Pause live log stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Filter Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-[#121822] text-[#94A3B8] hover:text-[#E2E8F0] border border-slate-700 rounded px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-[#66FCF1] cursor-pointer"
            >
              <option value="all">Filter: ALL</option>
              <option value="buy">Filter: ✅ WHALE / BUY</option>
              <option value="sell_error">Filter: ❌ SELL / ERROR</option>
              <option value="veto">Filter: ⏳ VETO / WAIT</option>
            </select>
          </div>

          {/* Copy Output */}
          <button
            onClick={copyTerminalOutput}
            className="p-1.5 rounded text-slate-400 hover:text-[#66FCF1] bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors"
            title="Copy terminal buffer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Buffer */}
          <button
            onClick={clearLogs}
            className="p-1.5 rounded text-slate-400 hover:text-[#EF4444] bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors"
            title="Clear terminal lines"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded text-slate-400 hover:text-[#66FCF1] bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors hidden sm:inline-flex"
            title={isFullscreen ? 'Exit full screen' : 'Expand terminal full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="relative">
        <div 
          ref={terminalRef}
          onScroll={handleScroll}
          className="bg-[#000000] p-4 font-mono text-xs sm:text-xs overflow-y-auto min-h-[380px] max-h-[560px] space-y-1.5 selection:bg-[#66FCF1]/30 selection:text-white"
        >
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-600 font-mono text-xs">
              No matching log entries found for current filter. Stream waiting for signals...
            </div>
          ) : (
            filteredLogs.map((log) => {
              // Syntax color determination
              let colorClass = "text-slate-500";
              if (log.category === 'buy') {
                colorClass = "text-emerald-400 font-medium";
              } else if (log.category === 'sell_error') {
                colorClass = "text-red-400 font-medium";
              } else if (log.category === 'veto_wait') {
                colorClass = "text-amber-400 font-medium";
              }

              return (
                <div 
                  key={log.id} 
                  className={`leading-relaxed tracking-tight break-all transition-colors duration-150 py-0.5 px-1 rounded hover:bg-white/5 ${colorClass}`}
                >
                  <span className="select-text">{log.formattedText}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Auto-scroll Warning & Jump to Bottom Button */}
        {!autoScroll && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-[#1F2833]/90 hover:bg-[#1F2833] border border-[#66FCF1]/40 text-[#66FCF1] px-3 py-1.5 rounded-full shadow-lg text-xs font-mono flex items-center gap-1.5 transition-all duration-300 animate-bounce"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Scroll la cel mai recent</span>
          </button>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div className="bg-[#090b10] border-t border-slate-800/80 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            cTrader FIX Session: <strong>ACTIVE</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span>PID Fleet: 10 / 10 Alive</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Auto-Scroll: <strong className={autoScroll ? "text-[#10B981]" : "text-[#F59E0B]"}>{autoScroll ? "LOCKED" : "PAUSED (MANUAL SCROLL)"}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[#66FCF1]">Rate: ~1.5 - 3.0s</span>
        </div>
      </div>
    </div>
  );
};
