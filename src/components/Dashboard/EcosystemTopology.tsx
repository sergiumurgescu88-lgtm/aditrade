import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Server, 
  ExternalLink, 
  Copy, 
  Check, 
  Cpu, 
  ShieldCheck, 
  Network, 
  Radio, 
  Terminal, 
  HardDrive, 
  BookOpen, 
  BarChart3, 
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface SubdomainNode {
  subdomain: string;
  name: string;
  role: string;
  url: string;
  type: 'CORE_SERVICE' | 'BOT_DASHBOARD' | 'SENTINEL_NODE';
  status: 'ONLINE';
  latency: string;
}

const SUBDOMAINS_DATA: SubdomainNode[] = [
  // 1. Core Services & Analytics
  {
    subdomain: 'doc.g4trade.online',
    name: 'Documentation Hub',
    role: 'Manual tehnic, strategii algo, pipeline cTrader & reguli VETO',
    url: 'https://doc.g4trade.online',
    type: 'CORE_SERVICE',
    status: 'ONLINE',
    latency: '1.2ms'
  },
  {
    subdomain: 'stats.g4trade.online',
    name: 'Performance Analytics',
    role: 'Audit Myfxbook live, Sharpe ratio, Profit factor & Equity curve',
    url: 'https://stats.g4trade.online',
    type: 'CORE_SERVICE',
    status: 'ONLINE',
    latency: '1.4ms'
  },
  {
    subdomain: 'live.g4trade.online',
    name: 'Real-time Log Stream',
    role: 'Flux continuu de loguri FIX/Protobuf, Z-Score news & execuții',
    url: 'https://live.g4trade.online',
    type: 'CORE_SERVICE',
    status: 'ONLINE',
    latency: '0.9ms'
  },
  {
    subdomain: 'g4trade.online',
    name: 'Master Gateway Hub',
    role: 'Portalul central Trinity Fund & rutare către sub-servicii',
    url: 'https://g4trade.online',
    type: 'CORE_SERVICE',
    status: 'ONLINE',
    latency: '1.1ms'
  },

  // 2. Individual Bot Nodes
  {
    subdomain: 'alpha.g4trade.online',
    name: 'Alpha (Sniper)',
    role: 'Multi-TF H1/M30/M15/M1 • Whale Volume > 1.8x • ADX > 35',
    url: 'https://alpha.g4trade.online',
    type: 'BOT_DASHBOARD',
    status: 'ONLINE',
    latency: '0.8ms'
  },
  {
    subdomain: 'beta.g4trade.online',
    name: 'Beta (Trend)',
    role: 'M15/H1 Trend Ride • Pullback EMA20/50 • Volum > 1.49x',
    url: 'https://beta.g4trade.online',
    type: 'BOT_DASHBOARD',
    status: 'ONLINE',
    latency: '0.9ms'
  },
  {
    subdomain: 'gamma.g4trade.online',
    name: 'Gamma (Scalper)',
    role: 'M1/M5 Ultra-Fast Cycle • Scalping Spread Zero • Volum > 1.3x',
    url: 'https://gamma.g4trade.online',
    type: 'BOT_DASHBOARD',
    status: 'ONLINE',
    latency: '0.7ms'
  },
  {
    subdomain: 'epsilon.g4trade.online',
    name: 'Epsilon (Liquidity)',
    role: 'Liquidity Hunter • Stop-run Sweep & Reversal institutional',
    url: 'https://epsilon.g4trade.online',
    type: 'BOT_DASHBOARD',
    status: 'ONLINE',
    latency: '0.9ms'
  },
  {
    subdomain: 'sergiu.g4trade.online',
    name: 'Sergiu (Flagship)',
    role: 'Nava-amiral a fondului • Opening Range Breakout London & NY',
    url: 'https://sergiu.g4trade.online',
    type: 'BOT_DASHBOARD',
    status: 'ONLINE',
    latency: '0.8ms'
  },

  // 3. Shadow Sentinel Nodes
  {
    subdomain: 'zeus.g4trade.online',
    name: 'Zeus (Macro Swing)',
    role: 'Corelație DXY / US TIPS / Gold pe time-frame zilnic D1',
    url: 'https://zeus.g4trade.online',
    type: 'SENTINEL_NODE',
    status: 'ONLINE',
    latency: '1.3ms'
  },
  {
    subdomain: 'ares.g4trade.online',
    name: 'Ares (Volatility Shock)',
    role: 'Spikes > 2.5x ATR • Absorbție de șocuri algoritmice pe M15',
    url: 'https://ares.g4trade.online',
    type: 'SENTINEL_NODE',
    status: 'ONLINE',
    latency: '1.0ms'
  },
  {
    subdomain: 'chronos.g4trade.online',
    name: 'Chronos (Time Guardian)',
    role: 'Drept de VETO suprem • Blocare 22:00 Rollover & Fixing LBMA Gold',
    url: 'https://chronos.g4trade.online',
    type: 'SENTINEL_NODE',
    status: 'ONLINE',
    latency: '0.5ms'
  },
  {
    subdomain: 'hades.g4trade.online',
    name: 'Hades (Microstructure)',
    role: 'Analiză Raport COT & Microstructură • Rezecție poziții contra-trend',
    url: 'https://hades.g4trade.online',
    type: 'SENTINEL_NODE',
    status: 'ONLINE',
    latency: '1.1ms'
  },
  {
    subdomain: 'hermes.g4trade.online',
    name: 'Hermes (News Catalyst)',
    role: 'Monitor macroeconomic • Filtrare T+15m deviații Z-Score la știri',
    url: 'https://hermes.g4trade.online',
    type: 'SENTINEL_NODE',
    status: 'ONLINE',
    latency: '1.2ms'
  }
];

export const EcosystemTopology: React.FC = () => {
  const [copiedIp, setCopiedIp] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CORE' | 'BOTS' | 'SENTINELS'>('ALL');

  const handleCopyIp = () => {
    navigator.clipboard.writeText('187.77.64.99');
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const filteredSubdomains = SUBDOMAINS_DATA.filter((item) => {
    if (activeFilter === 'CORE') return item.type === 'CORE_SERVICE';
    if (activeFilter === 'BOTS') return item.type === 'BOT_DASHBOARD';
    if (activeFilter === 'SENTINELS') return item.type === 'SENTINEL_NODE';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Section: Trinity Network Topology */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#66FCF1]/70 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 text-[#66FCF1]">
                <Globe className="w-5 h-5 text-[#66FCF1]" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                🌐 Trinity Network Topology
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-pulse text-[#10B981]" />
                14 HOSTS ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Arhitectura completă a clusterului Trinity Fund: toate subdomeniile și boții algoritmici rulează sincronizat pe infrastructura VPS dedicată din Frankfurt (LD4 Equinix), rutate prin DNS securizat și conexiune de latență sub-milisecundă către broker.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://doc.g4trade.online"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#121822] hover:bg-[#1A2330] border border-slate-700 hover:border-[#66FCF1]/60 text-slate-200 hover:text-[#66FCF1] text-xs font-mono font-semibold flex items-center gap-2 transition-all duration-300 shadow-md group"
            >
              <BookOpen className="w-4 h-4 text-[#66FCF1]" />
              <span>Full Documentation</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>

            <a
              href="https://stats.g4trade.online"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#66FCF1]/15 hover:bg-[#66FCF1]/25 border border-[#66FCF1]/50 text-[#66FCF1] hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all duration-300 shadow-md shadow-[#66FCF1]/10 group"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Live Statistics</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Server Node Status Card (High-Performance VPS Frankfurt LD4) */}
      <div className="bg-[#0B0C10] rounded-xl border border-slate-800 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1] shrink-0">
              <Server className="w-6 h-6 text-[#66FCF1]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                  Server Node Status: <span className="text-[#66FCF1]">srv1595784</span>
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  ONLINE • UPTIME 99.9%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Ubuntu 22.04 LTS (Kernel 6.6.0-generic x86_64) • Equinix Frankfurt LD4 Financial Hub
              </p>
            </div>
          </div>

          {/* Quick specs pill */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-[#121822] border border-slate-700/80 flex items-center gap-2">
              <span className="text-slate-400">HOST IP:</span>
              <strong className="text-white">187.77.64.99</strong>
              <button
                onClick={handleCopyIp}
                title="Copiază Host IP"
                className="p-1 hover:text-[#66FCF1] transition-colors"
              >
                {copiedIp ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#121822] border border-slate-700/80 text-slate-300">
              <span className="text-slate-400">DNS:</span> <span className="text-[#66FCF1]">A Record @ .g4trade.online</span>
            </div>
          </div>
        </div>

        {/* 4 Node Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-800 font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Broker Cross-Connect</div>
            <div className="text-base font-bold text-[#66FCF1] mt-1">0.8 ms FIX API</div>
            <div className="text-[10px] text-slate-500 mt-0.5">LD4 Optical Fiber Direct</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-800 font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">PM2 Master Node</div>
            <div className="text-base font-bold text-white mt-1">10 Clusters</div>
            <div className="text-[10px] text-[#10B981] mt-0.5">0 crashes in 48h</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-800 font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">SSL Certificate</div>
            <div className="text-base font-bold text-[#10B981] mt-1">TLS 1.3 Strict</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Wildcard *.g4trade.online</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-800 font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Reverse Proxy</div>
            <div className="text-base font-bold text-white mt-1">Nginx 1.24 HTTP/2</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Gzip & Brotli Enabled</div>
          </div>
        </div>
      </div>

      {/* 3. Subdomains Directory Grid with Category Filtering */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-[#66FCF1]" />
              Active Subdomain Nodes Directory
            </h3>
            <span className="text-xs font-mono text-slate-400">
              ({filteredSubdomains.length} afișate)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#0B0C10] border border-slate-800 rounded-lg p-1 text-xs font-mono flex-wrap">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                activeFilter === 'ALL'
                  ? 'bg-[#66FCF1] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Nodes ({SUBDOMAINS_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter('CORE')}
              className={`px-3 py-1 rounded transition-colors ${
                activeFilter === 'CORE'
                  ? 'bg-[#66FCF1] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Core & Stats (4)
            </button>
            <button
              onClick={() => setActiveFilter('BOTS')}
              className={`px-3 py-1 rounded transition-colors ${
                activeFilter === 'BOTS'
                  ? 'bg-[#66FCF1] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bots (5)
            </button>
            <button
              onClick={() => setActiveFilter('SENTINELS')}
              className={`px-3 py-1 rounded transition-colors ${
                activeFilter === 'SENTINELS'
                  ? 'bg-[#66FCF1] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sentinels (5)
            </button>
          </div>
        </div>

        {/* The Grid of Active Subdomain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubdomains.map((node, idx) => (
            <motion.a
              key={node.subdomain}
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="p-4 rounded-xl bg-[#1F2833]/80 hover:bg-[#1A2330] border border-slate-700/60 hover:border-[#66FCF1]/60 transition-all duration-300 group block shadow-md hover:shadow-lg hover:shadow-[#66FCF1]/10 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#121822] border border-slate-700 flex items-center justify-center text-[#66FCF1] group-hover:border-[#66FCF1]/50 transition-colors">
                    <Globe className="w-3.5 h-3.5 text-[#66FCF1]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white group-hover:text-[#66FCF1] transition-colors flex items-center gap-1.5">
                      <span>{node.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#66FCF1] transition-colors" />
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors">
                      {node.subdomain}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[9px] font-mono font-bold shrink-0">
                  {node.latency}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans line-clamp-2">
                {node.role}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  HTTP 200 OK
                </span>
                <span className="text-[#66FCF1] group-hover:underline flex items-center gap-1">
                  Deschide Subdomeniu <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};
