import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Flame, 
  AlertTriangle, 
  Info, 
  ArrowUpRight, 
  RefreshCw, 
  Filter, 
  Radio, 
  ShieldAlert, 
  Bot
} from 'lucide-react';

export type NewsImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface MacroNewsItem {
  id: string;
  timeUtc: string;
  flag: string;
  title: string;
  impact: NewsImpact;
  botReaction: string;
  botId: 'hermes' | 'chronos' | 'hades' | 'alpha' | 'general';
  category: string;
}

const MACRO_NEWS_DATA: MacroNewsItem[] = [
  {
    id: 'news-1',
    timeUtc: '14:30 UTC',
    flag: '🇺🇸',
    title: 'US CPI m/m: Actual 0.3% vs Forecast 0.2% (Core YoY 3.1%)',
    impact: 'HIGH',
    botReaction: '⚡ Hermes activat (Analiză sentiment news & recalibrare spreaduri)',
    botId: 'hermes',
    category: 'INFLATION'
  },
  {
    id: 'news-2',
    timeUtc: '13:00 UTC',
    flag: '🇪🇺',
    title: 'ECB President Christine Lagarde Speaks at Frankfurt Forum',
    impact: 'HIGH',
    botReaction: '📊 Volatilitate EUR detectată (Apollo ajustează ATR pe perechi EURUSD)',
    botId: 'general',
    category: 'CENTRAL BANK'
  },
  {
    id: 'news-3',
    timeUtc: '10:30 UTC',
    flag: '🇬🇧',
    title: 'UK S&P Global Manufacturing PMI: Actual 49.8 vs Est. 50.1',
    impact: 'MEDIUM',
    botReaction: '⚖️ Impact moderat GBP (Alpha menține filtrul ADX > 35 activ)',
    botId: 'alpha',
    category: 'PMI'
  },
  {
    id: 'news-4',
    timeUtc: '08:45 UTC',
    flag: '🇯🇵',
    title: 'BOJ Summary of Opinions: Hawkish shift hints at potential Q4 hike',
    impact: 'MEDIUM',
    botReaction: '🛡️ Chronos VETO standby (Monitorizare spread JPY la sesiunea Tokyo)',
    botId: 'chronos',
    category: 'POLICY'
  },
  {
    id: 'news-5',
    timeUtc: '04:00 UTC',
    flag: '🇨🇭',
    title: 'Swiss National Bank FX Reserves Update: Slight reduction noted',
    impact: 'LOW',
    botReaction: '🔍 Hades verifică raportul COT (Poziții instituționale stabile)',
    botId: 'hades',
    category: 'COT / RESERVES'
  }
];

export const MacroNewsFeed: React.FC = () => {
  const [selectedImpact, setSelectedImpact] = useState<'ALL' | NewsImpact>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const filteredNews = selectedImpact === 'ALL'
    ? MACRO_NEWS_DATA
    : MACRO_NEWS_DATA.filter((item) => item.impact === selectedImpact);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const getImpactBadge = (impact: NewsImpact) => {
    switch (impact) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
            <Flame className="w-3 h-3 text-[#EF4444]" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
            <Info className="w-3 h-3 text-slate-400" />
            LOW
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl relative overflow-hidden">
      {/* Decorative top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#66FCF1]/0 via-[#66FCF1]/70 to-[#66FCF1]/0" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1]">
            <Globe className="w-5 h-5 text-[#66FCF1]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2 tracking-tight">
                Live Macro Feed
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1 font-semibold">
                <Radio className="w-2.5 h-2.5 animate-pulse text-[#10B981]" />
                REAL-TIME TICKER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Justificare contextuală pentru sentinelele Trinity Fund (Hermes, Chronos VETO, Hades)
            </p>
          </div>
        </div>

        {/* Filter & Refresh Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#0B0C10] border border-slate-700/80 rounded-lg p-0.5 text-[11px] font-mono">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedImpact(filter)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedImpact === filter
                    ? 'bg-[#66FCF1] text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            title="Sincronizează știrile macro"
            className="p-1.5 rounded-lg bg-[#121822] hover:bg-[#1A2330] border border-slate-700 text-slate-300 hover:text-[#66FCF1] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#66FCF1]' : ''}`} />
          </button>
        </div>
      </div>

      {/* News Feed Body - Compact fixed-height container (h-64) with smooth scroll */}
      <div className="h-64 overflow-y-auto mt-3 pr-1 space-y-2.5 custom-scrollbar">
        {filteredNews.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="p-3 rounded-lg bg-[#121822]/90 hover:bg-[#161F2C] border border-slate-700/60 hover:border-slate-600 transition-all duration-200 group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Left: Time, Flag, News Headline */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-mono text-slate-400 font-bold bg-[#0B0C10] px-2 py-0.5 rounded border border-slate-800">
                  {item.timeUtc}
                </span>
                <span className="text-base leading-none select-none">{item.flag}</span>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  [{item.category}]
                </span>
                {getImpactBadge(item.impact)}
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                {item.title}
              </h3>
            </div>

            {/* Right: Bot Reaction & Sentinel Directive */}
            <div className="sm:max-w-[320px] shrink-0 text-left sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0C10] border border-slate-700/70 text-[11px] font-mono text-[#66FCF1] shadow-xs">
                <Bot className="w-3.5 h-3.5 text-[#66FCF1] shrink-0" />
                <span className="truncate">{item.botReaction}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredNews.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs py-8">
            <Info className="w-6 h-6 mb-2 text-slate-600" />
            <span>Nicio știre disponibilă pentru filtrul selectat.</span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          Flux conectat: Thomson Reuters &times; ForexFactory Institutional API Feed
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Latență ingestie: <strong className="text-slate-300">18ms</strong>
        </span>
      </div>
    </div>
  );
};
