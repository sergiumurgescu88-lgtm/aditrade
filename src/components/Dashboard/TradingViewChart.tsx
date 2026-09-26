import React, { useState } from 'react';
import { 
  BarChart2, 
  ExternalLink, 
  Radio, 
  Clock, 
  Maximize2 
} from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'dark' | 'light';
  height?: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol: initialSymbol = 'OANDA:XAUUSD',
  interval: initialInterval = '60',
  theme = 'dark',
  height = 'h-[380px] sm:h-[550px]'
}) => {
  const [currentSymbol, setCurrentSymbol] = useState<string>(initialSymbol);
  const [currentInterval, setCurrentInterval] = useState<string>(initialInterval);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Construct official, isolated TradingView embed URL
  // This avoids tv.js script injection which violates Same-Origin Policy (SOP) inside iframed sandbox environments
  const encodedSymbol = encodeURIComponent(currentSymbol);
  const encodedInterval = encodeURIComponent(currentInterval);
  const chartUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_xauusd&symbol=${encodedSymbol}&interval=${encodedInterval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=0B0C10&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&locale=en&utm_source=trinityfund&utm_medium=widget&utm_campaign=chart&utm_term=${encodedSymbol}`;

  const availableIntervals = [
    { label: '15m', value: '15' },
    { label: '1h', value: '60' },
    { label: '4h', value: '240' },
    { label: '1D', value: 'D' }
  ];

  return (
    <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-[#66FCF1]/20 shadow-xl overflow-hidden relative">
      {/* Subtle top neon accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#66FCF1]/60 to-transparent" />

      {/* Header bar */}
      <div className="px-4 sm:px-5 py-3 bg-[#121822]/90 border-b border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1]">
            <BarChart2 className="w-4 h-4 text-[#66FCF1]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold font-mono text-white flex items-center gap-2">
                <span>📊 Live Market Data • {currentSymbol.split(':')[1] || currentSymbol} • Powered by TradingView</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Gold vs US Dollar (Spot) • Timeframe: {currentInterval === 'D' ? 'Daily (1D)' : `${currentInterval}m`} • Sincronizat cu algoritmii Trinity
            </p>
          </div>
        </div>

        {/* Right Info Tags & Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          {/* Quick timeframe selector */}
          <div className="flex items-center bg-[#0B0C10] border border-slate-800 rounded-lg p-0.5">
            {availableIntervals.map((tf) => (
              <button
                key={tf.value}
                onClick={() => {
                  setCurrentInterval(tf.value);
                  setIsLoading(true);
                }}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  currentInterval === tf.value
                    ? 'bg-[#66FCF1] text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <a
            href="https://www.tradingview.com/symbols/XAUUSD/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-[#121822] hover:bg-[#1A2330] border border-slate-700 hover:border-[#66FCF1]/60 text-slate-300 hover:text-[#66FCF1] text-[11px] flex items-center gap-1.5 transition-colors group"
            title="Deschide în TradingView"
          >
            <span>Full Chart</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* TradingView Chart Container with Isolated Native Iframe */}
      <div className={`w-full ${height} relative bg-[#0B0C10]`}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0C10]/90 z-10 gap-3 text-slate-400 font-mono text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-[#66FCF1]/20 border-t-[#66FCF1] animate-spin" />
            <span>Se încarcă fluxul grafic în timp real TradingView...</span>
          </div>
        )}
        <iframe
          key={`${currentSymbol}-${currentInterval}`}
          title="TradingView Real-Time Chart"
          src={chartUrl}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Footer bar */}
      <div className="px-4 py-2 bg-[#0E131A] border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-[#10B981]" />
          Stream activ: Time-frame {currentInterval === 'D' ? '1D' : `${currentInterval}m`} aliniat cu senzorii Alpha Sniper & Sergiu London ORB
        </span>
        <span className="hidden sm:inline text-slate-400">
          Spread Tipic XAUUSD: <strong className="text-white">1.1 - 1.4 pips</strong>
        </span>
      </div>
    </div>
  );
};
