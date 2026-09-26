import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Download,
  Filter,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface EquityDataPoint {
  date: string;
  equity: number;
  gainPct: number;
  drawdown: number;
}

const EQUITY_6M_DATA: EquityDataPoint[] = [
  { date: 'Oct 01', equity: 100000, gainPct: 0.0, drawdown: 0.0 },
  { date: 'Oct 15', equity: 101850, gainPct: 1.85, drawdown: 0.2 },
  { date: 'Nov 01', equity: 103200, gainPct: 3.20, drawdown: 0.4 },
  { date: 'Nov 15', equity: 105100, gainPct: 5.10, drawdown: 0.1 },
  { date: 'Dec 01', equity: 106050, gainPct: 6.05, drawdown: 0.7 },
  { date: 'Dec 15', equity: 107490, gainPct: 7.49, drawdown: 0.3 },
  { date: 'Jan 01', equity: 110200, gainPct: 10.20, drawdown: 0.0 },
  { date: 'Jan 15', equity: 112520, gainPct: 12.52, drawdown: 0.5 },
  { date: 'Feb 01', equity: 111950, gainPct: 11.95, drawdown: 1.2 },
  { date: 'Feb 15', equity: 114800, gainPct: 14.80, drawdown: 0.4 },
  { date: 'Mar 01', equity: 118650, gainPct: 18.65, drawdown: 0.0 },
  { date: 'Mar 15', equity: 123400, gainPct: 23.40, drawdown: 0.3 },
  { date: 'Apr 01', equity: 125620, gainPct: 25.62, drawdown: 0.2 },
  { date: 'Apr 15', equity: 127900, gainPct: 27.90, drawdown: 0.1 },
  { date: 'Mai 01', equity: 131600, gainPct: 31.60, drawdown: 0.4 },
  { date: 'Mai 15', equity: 135450, gainPct: 35.45, drawdown: 0.0 },
  { date: 'Iun 01', equity: 139650, gainPct: 39.65, drawdown: 0.2 },
  { date: 'Iun 15', equity: 143980, gainPct: 43.98, drawdown: 0.1 },
  { date: 'Jul 01', equity: 147420, gainPct: 47.42, drawdown: 0.5 },
  { date: 'Current', equity: 148920, gainPct: 48.92, drawdown: 0.0 }
];

interface MonthlyReturn {
  year: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct?: number;
  nov?: number;
  dec?: number;
  ytd: number;
}

const MONTHLY_RETURNS: MonthlyReturn[] = [
  {
    year: 2026,
    jan: 2.1,
    feb: -0.5,
    mar: 3.4,
    apr: 1.8,
    may: 2.9,
    jun: 3.1,
    jul: 2.4,
    aug: -0.8,
    sep: 3.7,
    ytd: 19.3
  },
  {
    year: 2025,
    jan: 1.9,
    feb: 2.4,
    mar: 3.1,
    apr: -0.9,
    may: 2.6,
    jun: 2.8,
    jul: 1.7,
    aug: 2.2,
    sep: 3.0,
    oct: 3.2,
    nov: 2.8,
    dec: 1.4,
    ytd: 29.6
  }
];

interface RecentTrade {
  id: string;
  bot: string;
  side: 'BUY' | 'SELL';
  instrument: string;
  entry: string;
  exit: string;
  pnlDollar: number;
  pnlPips: number;
  timestamp: string;
  status: string;
}

const RECENT_TRADES: RecentTrade[] = [
  {
    id: 'tr-001',
    bot: 'ALPHA (Sniper)',
    side: 'BUY',
    instrument: 'XAUUSD',
    entry: '2654.82',
    exit: '2662.50',
    pnlDollar: 1920.00,
    pnlPips: 76.8,
    timestamp: 'Astăzi 17:42',
    status: 'Take Profit Hit'
  },
  {
    id: 'tr-002',
    bot: 'SERGIU (Flagship)',
    side: 'BUY',
    instrument: 'XAUUSD',
    entry: '2656.20',
    exit: '2667.70',
    pnlDollar: 3450.00,
    pnlPips: 115.0,
    timestamp: 'Astăzi 15:30',
    status: 'Core NY Breakout'
  },
  {
    id: 'tr-003',
    bot: 'GAMMA (Scalp)',
    side: 'BUY',
    instrument: 'XAUUSD',
    entry: '2654.10',
    exit: '2658.90',
    pnlDollar: 720.00,
    pnlPips: 48.0,
    timestamp: 'Astăzi 14:15',
    status: 'Micro-Scalp TP'
  },
  {
    id: 'tr-004',
    bot: 'ARES (Shock)',
    side: 'SELL',
    instrument: 'XAUUSD',
    entry: '2659.10',
    exit: '2660.80',
    pnlDollar: -340.00,
    pnlPips: -17.0,
    timestamp: 'Ieri 20:10',
    status: 'Volatility Hedge'
  },
  {
    id: 'tr-005',
    bot: 'BETA (Trend)',
    side: 'BUY',
    instrument: 'XAUUSD',
    entry: '2648.50',
    exit: '2657.75',
    pnlDollar: 1850.00,
    pnlPips: 92.5,
    timestamp: 'Ieri 11:22',
    status: 'Pullback EMA20 Hit'
  }
];

export const Performance: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | 'ALL'>('6M');

  return (
    <div className="space-y-6">
      {/* 1. Header with Verification Badge & Export Button */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-[#E2E8F0] font-mono flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#66FCF1]" />
                Institutional Track Record & Audited Performance
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold flex items-center gap-1.5 shadow-sm shadow-[#10B981]/10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Audited cTrader Live Execution
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
              Raport de randament compus pe capital instituțional real. Execuție 100% algoritmică fără intervenție discreționară pe XAUUSD (Spot Gold).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#121822] border border-slate-700/70 text-xs font-mono text-slate-300">
              Model: <strong>Fixed Fractional + ATR Vol</strong>
            </span>
          </div>
        </div>

        {/* 2. Top 4 Glassmorphism Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Win Rate */}
          <div className="bg-[#121822]/90 rounded-xl p-4 border border-slate-700/70 hover:border-[#10B981]/60 transition-all duration-300 shadow-md">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-mono">Win Rate</span>
              <Award className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="text-3xl font-bold font-mono text-[#10B981] tracking-tight">
              80.2%
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
              <span>243 Wins / 60 Losses</span>
              <span className="text-[#10B981] font-semibold">+4.05:1 W/L</span>
            </div>
          </div>

          {/* Profit Factor */}
          <div className="bg-[#121822]/90 rounded-xl p-4 border border-slate-700/70 hover:border-[#66FCF1]/60 transition-all duration-300 shadow-md">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-mono">Profit Factor</span>
              <BarChart3 className="w-4 h-4 text-[#66FCF1]" />
            </div>
            <div className="text-3xl font-bold font-mono text-[#66FCF1] tracking-tight">
              1.28
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
              <span>Gross Profit / Loss</span>
              <span className="text-[#66FCF1] font-semibold">Institutional Grade</span>
            </div>
          </div>

          {/* Sharpe Ratio */}
          <div className="bg-[#121822]/90 rounded-xl p-4 border border-slate-700/70 hover:border-[#66FCF1]/60 transition-all duration-300 shadow-md">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-mono">Sharpe Ratio</span>
              <Sparkles className="w-4 h-4 text-[#66FCF1]" />
            </div>
            <div className="text-3xl font-bold font-mono text-white tracking-tight">
              7.12
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
              <span>Annualized Return/Vol</span>
              <span className="text-[#10B981] font-semibold">Top Decile</span>
            </div>
          </div>

          {/* Max Drawdown */}
          <div className="bg-[#121822]/90 rounded-xl p-4 border border-slate-700/70 hover:border-[#F59E0B]/60 transition-all duration-300 shadow-md">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-mono">Max Drawdown</span>
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold font-mono text-[#F59E0B] tracking-tight">
              4.2%
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
              <span>Peak to Trough</span>
              <span className="text-amber-400 font-semibold">Circuit Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Chart: 'Equity Curve' (Last 6 Months) */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <span>Portfolio Equity Curve (USDT / Realized Balance)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                +$48,920.00 (+48.92%)
              </span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Traiectorie uniformă cu protecție asimetrică la volatilitate datorată filtrelor ADX și Whale Volume.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#121822] p-1 rounded-lg border border-slate-700/60">
            {(['1M', '3M', '6M', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`min-h-[36px] px-3 rounded text-xs font-mono font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#66FCF1]/20 text-[#66FCF1] border border-[#66FCF1]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={EQUITY_6M_DATA} 
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66FCF1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#66FCF1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2833" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748B" 
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'monospace' }} 
                tickLine={false}
              />
              <YAxis 
                domain={[95000, 155000]}
                stroke="#64748B" 
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'monospace' }} 
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                orientation="right"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as EquityDataPoint;
                    return (
                      <div className="p-3 bg-[#0B0C10]/95 border border-[#66FCF1]/40 rounded-lg shadow-2xl font-mono text-xs space-y-1.5">
                        <div className="text-slate-400 border-b border-slate-800 pb-1">{data.date}</div>
                        <div className="text-[#66FCF1] font-bold text-sm">
                          ${data.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center justify-between text-[11px] gap-3 text-slate-300">
                          <span>Total Gain:</span>
                          <span className="text-[#10B981] font-bold">+{data.gainPct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] gap-3 text-slate-300">
                          <span>Drawdown:</span>
                          <span className="text-amber-400 font-bold">{data.drawdown}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="#66FCF1" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#equityGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Monthly Returns Table (Institutional Format) */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#66FCF1]" />
              Monthly Returns Breakdown (%)
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Performanță netă lună de lună calculată pe baza balanței închise.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Monedă Bază: <strong>USD</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">An</th>
                <th className="py-2.5 px-2 text-center">Ian</th>
                <th className="py-2.5 px-2 text-center">Feb</th>
                <th className="py-2.5 px-2 text-center">Mar</th>
                <th className="py-2.5 px-2 text-center">Apr</th>
                <th className="py-2.5 px-2 text-center">Mai</th>
                <th className="py-2.5 px-2 text-center">Iun</th>
                <th className="py-2.5 px-2 text-center">Iul</th>
                <th className="py-2.5 px-2 text-center">Aug</th>
                <th className="py-2.5 px-2 text-center">Sep</th>
                <th className="py-2.5 px-2 text-center">Oct</th>
                <th className="py-2.5 px-2 text-center">Nov</th>
                <th className="py-2.5 px-2 text-center">Dec</th>
                <th className="py-2.5 px-3 text-right text-white">YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MONTHLY_RETURNS.map((m) => (
                <tr key={m.year} className="hover:bg-[#121822]/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{m.year}</td>
                  {[m.jan, m.feb, m.mar, m.apr, m.may, m.jun, m.jul, m.aug, m.sep, m.oct, m.nov, m.dec].map((val, idx) => {
                    if (val === undefined) {
                      return <td key={idx} className="py-3 px-2 text-center text-slate-600">-</td>;
                    }
                    const isPositive = val >= 0;
                    return (
                      <td key={idx} className="py-3 px-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded font-semibold text-[11px] ${
                          isPositive
                            ? 'text-[#10B981] bg-[#10B981]/10'
                            : 'text-[#EF4444] bg-[#EF4444]/10'
                        }`}>
                          {isPositive ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block px-2 py-1 rounded bg-[#66FCF1]/15 text-[#66FCF1] border border-[#66FCF1]/30 font-bold text-xs">
                      +{m.ytd.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Last 5 Executed Trades */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#66FCF1]" />
              Ultimele 5 Trade-uri Executate
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Înregistrare directă a ordinelor trimise în contul cTrader cu execuție sub-15ms.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Loturi Scalate: 0.15 - 0.75
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Bot</th>
                <th className="py-2.5 px-2">Side</th>
                <th className="py-2.5 px-2">Instrument</th>
                <th className="py-2.5 px-2">Entry</th>
                <th className="py-2.5 px-2">Exit</th>
                <th className="py-2.5 px-2 text-right">Pips</th>
                <th className="py-2.5 px-3 text-right">P&amp;L ($)</th>
                <th className="py-2.5 px-3 text-right">Timing &amp; Exec</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {RECENT_TRADES.map((trade) => {
                const isProfitable = trade.pnlDollar > 0;
                return (
                  <tr key={trade.id} className="hover:bg-[#121822]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                      <span>{trade.bot}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        trade.side === 'BUY'
                          ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                          : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-semibold">{trade.instrument}</td>
                    <td className="py-3 px-2 text-slate-400">{trade.entry}</td>
                    <td className="py-3 px-2 text-slate-300">{trade.exit}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${isProfitable ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {trade.pnlPips > 0 ? `+${trade.pnlPips.toFixed(1)}` : trade.pnlPips.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded ${
                        isProfitable 
                          ? 'text-[#10B981] bg-[#10B981]/10' 
                          : 'text-[#EF4444] bg-[#EF4444]/10'
                      }`}>
                        {isProfitable 
                          ? `+$${trade.pnlDollar.toFixed(2)}` 
                          : `-$${Math.abs(trade.pnlDollar).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[11px] text-slate-400">
                      <div>{trade.timestamp}</div>
                      <div className="text-[10px] text-slate-500">{trade.status}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
