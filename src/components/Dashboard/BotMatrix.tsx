import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Flame, 
  ShieldAlert, 
  Activity, 
  Zap, 
  BarChart2, 
  Lock, 
  ArrowUpRight 
} from 'lucide-react';

export interface BotData {
  id: string;
  name: string;
  codename: string;
  icon: string;
  subtitle: string;
  status: 'LIVE' | 'GATEWAY' | 'VETO';
  statusBadge: string;
  lotRange: string;
  riskPct: string;
  whaleMin: string;
  adxMin: string;
  humanExplanation: string;
  executionRoute: 'DIRECT' | 'GATEWAY' | 'CIRCUIT BREAKER';
  timeframe: string;
}

const BOTS_DATA: BotData[] = [
  {
    id: 'alpha',
    name: 'ALPHA',
    codename: 'Sniper',
    icon: '🎯',
    subtitle: 'Sniper - Precizie Maximă',
    status: 'LIVE',
    statusBadge: '🟢 LIVE',
    lotRange: '0.10 - 0.50',
    riskPct: '0.5% - 1.0%',
    whaleMin: '> 1.80x',
    adxMin: '> 35',
    humanExplanation: 'Alpha este ca un lunetist de elită: așteaptă răbdător ore întregi până când toate time-frame-urile (H1/M30/M15/M1) se aliniază perfect, iar "balenele" intră cu un volum masiv (>1.8x). Dacă scorul compozit depășește 85/100, execută direct cu precizie chirurgicală.',
    executionRoute: 'DIRECT',
    timeframe: 'Multi-TF (H1/M30/M15/M1)'
  },
  {
    id: 'beta',
    name: 'BETA',
    codename: 'Trend',
    icon: '📈',
    subtitle: 'Trend - Pullback EMA20/50',
    status: 'LIVE',
    statusBadge: '🟢 LIVE',
    lotRange: '0.20 - 0.80',
    riskPct: '1.0% - 1.5%',
    whaleMin: '> 1.49x',
    adxMin: '> 35',
    humanExplanation: 'Beta este călărețul de trend: identifică impulsul direcțional major și intră pe retragerile optime (pullback la mediile EMA 20 și 50), confirmat de un impuls de volum instituțional de peste 1.49x. Își ajustează trailing stop-ul pentru a lăsa profitul să curgă.',
    executionRoute: 'DIRECT',
    timeframe: 'M15 / H1 Trend Ride'
  },
  {
    id: 'gamma',
    name: 'GAMMA',
    codename: 'Scalper',
    icon: '⚡',
    subtitle: 'Scalper - Viteză M1/M5',
    status: 'LIVE',
    statusBadge: '🟢 LIVE',
    lotRange: '0.10 - 0.40',
    riskPct: '0.5%',
    whaleMin: '> 1.30x',
    adxMin: '> 20',
    humanExplanation: 'Gamma este sprinterul de înaltă frecvență: prinde dezechilibre rapide de carnet de ordine și impulsuri de volum micro (>1.3x) pe M1 și M5. Iese ultra-rapid cu take profit strâns (3-8 pips), reducând la minimum expunerea pe piață.',
    executionRoute: 'DIRECT',
    timeframe: 'M1 / M5 Fast Cycle'
  },
  {
    id: 'epsilon',
    name: 'EPSILON',
    codename: 'Liquidity Hunter',
    icon: '🌊',
    subtitle: 'Liquidity - Sweep & Reversal',
    status: 'LIVE',
    statusBadge: '🟢 LIVE',
    lotRange: '0.15 - 0.60',
    riskPct: '1.0%',
    whaleMin: '> 1.40x',
    adxMin: 'Dynamic',
    humanExplanation: 'Epsilon este vânătorul de lichiditate instituțională: pândește momentele când piața curăță vârfurile sau minimele de sesiune (stop hunts / sweeps). Când retail-ul este prins în capcană și volumul explodează (>1.4x), intră pe reversare violentă.',
    executionRoute: 'DIRECT',
    timeframe: 'M15 / M30 Swings'
  },
  {
    id: 'sergiu',
    name: 'SERGIU',
    codename: 'Flagship Core',
    icon: '👑',
    subtitle: 'Flagship Core - ORB Londra / NY',
    status: 'LIVE',
    statusBadge: '🟢 LIVE',
    lotRange: '0.50 - 1.50',
    riskPct: '1.5% - 2.0%',
    whaleMin: '> 1.50x',
    adxMin: '> 25',
    humanExplanation: 'Sergiu este nava-amiral a fondului Trinity: specializat pe deschiderea sesiunilor majore de lichiditate de la Londra și New York (Opening Range Breakout). Dacă spargerea primei ferestre de 15 minute este validată cu volum >1.5x și ADX > 25, execută poziția principală a zilei.',
    executionRoute: 'DIRECT',
    timeframe: 'London & NY Opens'
  },
  {
    id: 'zeus',
    name: 'ZEUS',
    codename: 'Macro Swing',
    icon: '⚡️',
    subtitle: 'Macro Swing - DXY & TIPS',
    status: 'GATEWAY',
    statusBadge: '🔵 GATEWAY',
    lotRange: '0.20 - 0.50',
    riskPct: '1.0%',
    whaleMin: 'Cross-Asset',
    adxMin: '> 30 (D1)',
    humanExplanation: 'Zeus privește piața din perspectivă macro: monitorizează corelațiile inverse dintre indicele dolarului american (DXY), randamentele reale ale titlurilor TIPS și aur. Când apare un decalaj pe graficul zilnic (D1), rutează ordinul prin serviciul Gateway.',
    executionRoute: 'GATEWAY',
    timeframe: 'Daily (D1) / Weekly'
  },
  {
    id: 'ares',
    name: 'ARES',
    codename: 'Volatility Shock',
    icon: '💥',
    subtitle: 'Shock - Spikes > 2.5x ATR',
    status: 'GATEWAY',
    statusBadge: '🔵 GATEWAY',
    lotRange: '0.10 - 0.30',
    riskPct: '0.5%',
    whaleMin: 'Shock Spike',
    adxMin: '> 40',
    humanExplanation: 'Ares este trezit doar de exploziile neprogramate de volatilitate: când o lumânare de 15 minute depășește de peste 2.5 ori valoarea normală ATR, capturează unda de șoc și rebalansarea algoritmică a pieței prin Gateway.',
    executionRoute: 'GATEWAY',
    timeframe: 'M15 Dynamic Impulse'
  },
  {
    id: 'hermes',
    name: 'HERMES',
    codename: 'News Catalyst',
    icon: '🗞️',
    subtitle: 'News Catalyst - Z-Score la T+15m',
    status: 'GATEWAY',
    statusBadge: '🔵 GATEWAY',
    lotRange: '0.15 - 0.40',
    riskPct: '0.8%',
    whaleMin: 'Absorption',
    adxMin: '> 28',
    humanExplanation: 'Hermes este specialistul pe evenimente economice: recent optimizat să evite primele 14 minute de zgomot și spread toxic post-știri. La exact T+15 minute calculează deviația Z-Score dintre datele reale și cele prognozate, intrând pe trendul curat.',
    executionRoute: 'GATEWAY',
    timeframe: 'T+15m Post-Release'
  },
  {
    id: 'chronos',
    name: 'CHRONOS',
    codename: 'Time Guardian',
    icon: '⏳',
    subtitle: 'Time Guardian - VETO LBMA & 22:00',
    status: 'VETO',
    statusBadge: '🟡 VETO',
    lotRange: 'VETO LOCK',
    riskPct: '0.0% (BLOCK)',
    whaleMin: 'N/A',
    adxMin: 'N/A',
    humanExplanation: 'Chronos este gardianul temporal absolut: are drept de veto suprem peste toți ceilalți 9 boți. Blochează orice tranzacționare în timpul fixing-ului LBMA Gold și în fereastra critică de Rollover zilnic (22:00 ora României), apărând capitalul de spread-uri monstruoase.',
    executionRoute: 'CIRCUIT BREAKER',
    timeframe: 'Continuous Sentinel'
  },
  {
    id: 'hades',
    name: 'HADES',
    codename: 'COT Sentinel',
    icon: '🏛️',
    subtitle: 'COT Sentinel - VETO Crowding > 90%',
    status: 'VETO',
    statusBadge: '🟡 VETO',
    lotRange: 'VETO LOCK',
    riskPct: '0.0% (BLOCK)',
    whaleMin: 'Perc. > 90%',
    adxMin: 'N/A',
    humanExplanation: 'Hades este santinela raportului săptămânal Commitment of Traders (COT): dacă fondurile speculative de hedging ating o expunere extremă (peste percentila 90% istorică), blochează orice intrare în direcția aglomerată pentru a preveni lichidările bruște.',
    executionRoute: 'CIRCUIT BREAKER',
    timeframe: 'Weekly COT Sentinel'
  }
];

interface BotMatrixProps {
  onSelectBot?: (botId: string) => void;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

export const BotMatrix: React.FC<BotMatrixProps> = ({ onSelectBot, isLoading = false }) => {
  const [expandedBots, setExpandedBots] = useState<Record<string, boolean>>({
    alpha: true // Alpha expanded by default as flagship demonstration
  });

  const toggleExpand = (botId: string) => {
    setExpandedBots(prev => ({
      ...prev,
      [botId]: !prev[botId]
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded shimmer-element" />
            <div className="h-3 w-72 rounded shimmer-element" />
          </div>
          <div className="flex gap-3">
            <div className="h-4 w-20 rounded shimmer-element" />
            <div className="h-4 w-20 rounded shimmer-element" />
            <div className="h-4 w-20 rounded shimmer-element" />
          </div>
        </div>

        {/* Shimmer Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[#1F2833]/70 rounded-xl border border-slate-700/50 p-5 shadow-xl flex flex-col justify-between space-y-4 min-h-[340px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg shimmer-element" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-20 rounded shimmer-element" />
                      <div className="h-2.5 w-14 rounded shimmer-element" />
                    </div>
                  </div>
                  <div className="h-5 w-16 rounded-full shimmer-element" />
                </div>

                <div className="h-3 w-3/4 rounded shimmer-element mb-4" />

                {/* 2x2 stats skeleton */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#121822]/70 border border-slate-700/40 mb-3">
                  <div className="h-10 rounded shimmer-element" />
                  <div className="h-10 rounded shimmer-element" />
                  <div className="h-10 rounded shimmer-element" />
                  <div className="h-10 rounded shimmer-element" />
                </div>

                <div className="h-7 w-full rounded shimmer-element" />
              </div>

              <div className="pt-3 border-t border-slate-700/50">
                <div className="h-8 w-full rounded shimmer-element" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-[#E2E8F0] flex items-center gap-2">
            <span>Trinity Bot Matrix</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/30">
              10 ALGORITHMIC NODES
            </span>
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Direct execution engines, cross-asset gateways, and risk veto circuit breakers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" /> 5 Direct
          </span>
          <span className="flex items-center gap-1.5 text-[#66FCF1]">
            <span className="h-2 w-2 rounded-full bg-[#66FCF1]" /> 3 Gateway
          </span>
          <span className="flex items-center gap-1.5 text-[#F59E0B]">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> 2 Veto
          </span>
        </div>
      </div>

      {/* 4-Column Responsive Grid with Staggered Fade-in */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {BOTS_DATA.map((bot) => {
          const isExpanded = !!expandedBots[bot.id];

          return (
            <motion.div
              key={bot.id}
              variants={cardVariants}
              className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#66FCF1]/10 hover:-translate-y-1 hover:border-[#66FCF1]/50 group"
            >
              {/* 1. Header & Badges */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none" role="img" aria-label={bot.name}>
                      {bot.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold font-mono tracking-tight text-[#E2E8F0]">
                          {bot.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        ({bot.codename})
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                    bot.status === 'LIVE'
                      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 font-semibold shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                      : bot.status === 'GATEWAY'
                      ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/30 font-semibold shadow-[0_0_8px_rgba(102,252,241,0.15)]'
                      : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 font-semibold shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                  }`}>
                    {bot.statusBadge}
                  </span>
                </div>

                {/* 2. Subtitle */}
                <p className="text-xs text-[#94A3B8] font-sans mb-3 line-clamp-1">
                  {bot.subtitle}
                </p>

                {/* 3. 2x2 Stats Grid with subtle contrast background */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#121822]/90 border border-slate-700/50 mb-3 text-xs font-mono">
                  <div className="p-1.5 rounded bg-[#1F2833]/50">
                    <span className="text-[10px] text-slate-400 block uppercase">Lot Size</span>
                    <span className="text-[#E2E8F0] font-semibold">{bot.lotRange}</span>
                  </div>

                  <div className="p-1.5 rounded bg-[#1F2833]/50">
                    <span className="text-[10px] text-slate-400 block uppercase">Risc Max</span>
                    <span className={`${
                      bot.status === 'VETO' ? 'text-[#F59E0B]' : 'text-[#66FCF1]'
                    } font-semibold`}>
                      {bot.riskPct}
                    </span>
                  </div>

                  <div className="p-1.5 rounded bg-[#1F2833]/50">
                    <span className="text-[10px] text-slate-400 block uppercase">Whale Min</span>
                    <span className="text-[#66FCF1] font-semibold">{bot.whaleMin}</span>
                  </div>

                  <div className="p-1.5 rounded bg-[#1F2833]/50">
                    <span className="text-[10px] text-slate-400 block uppercase">ADX Min</span>
                    <span className="text-[#E2E8F0] font-semibold">{bot.adxMin}</span>
                  </div>
                </div>

                {/* 4. Expandable Accordion: Detalii Strategii */}
                <div className="mb-3">
                  <button
                    onClick={() => toggleExpand(bot.id)}
                    className="w-full py-1.5 px-2.5 rounded-md bg-[#121822]/60 hover:bg-[#121822] border border-slate-700/50 text-xs font-mono text-[#94A3B8] hover:text-[#66FCF1] flex items-center justify-between transition-all duration-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>Detalii Strategie</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#66FCF1]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {/* Smooth expansion block */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-3 rounded-lg bg-[#0B0C10]/90 border border-slate-800 text-xs text-[#E2E8F0] leading-relaxed font-sans shadow-inner">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#66FCF1] mb-1 font-semibold flex items-center justify-between">
                        <span>Explicație Umană</span>
                        <span className="text-slate-500 font-normal">{bot.executionRoute}</span>
                      </div>
                      <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                        {bot.humanExplanation}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Fereastră:</span>
                        <span className="text-[#E2E8F0]">{bot.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Footer: Button Accesează Dashboard with Outline Style */}
              <div className="pt-3 border-t border-slate-700/60 mt-2">
                <button
                  onClick={() => onSelectBot ? onSelectBot(bot.id) : null}
                  className="w-full py-2 px-3 rounded-lg border border-[#66FCF1]/40 hover:border-[#66FCF1] bg-transparent hover:bg-[#66FCF1]/10 text-[#66FCF1] text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-[0_0_12px_rgba(102,252,241,0.18)]"
                >
                  <span>Accesează Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
