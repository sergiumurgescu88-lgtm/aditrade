import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Network, 
  Zap, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  GitBranch, 
  Layers, 
  HardDrive,
  Radio,
  FileCheck2,
  Database,
  Globe
} from 'lucide-react';
import { EcosystemTopology } from './EcosystemTopology';

interface SystemHealthProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ onRefresh, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'ecosystem' | 'sentinels' | 'hardware'>('topology');

  return (
    <div className="space-y-6">
      {/* 1. Header with Status & Soluție Activă Badge */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-[#E2E8F0] flex items-center gap-2 font-mono">
                <Network className="w-5 h-5 text-[#66FCF1]" />
                System Health & cTrader Topology
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold flex items-center gap-1.5 shadow-sm shadow-[#10B981]/10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Soluție Activă: 5/5 Conexiuni Optimizate prin Gateway Centralizat
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
              Arhitectură de rutare scalabilă ce depășește limita hardware cTrader Open API (5 conexiuni FIX/Protobuf) fără latență adăugată pentru nodurile de execuție directă.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-[#121822] border border-slate-700/70 text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
              <span>Host: <strong>srv1595784</strong> (Frankfurt LD4)</span>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#66FCF1]/15 hover:bg-[#66FCF1]/25 border border-[#66FCF1]/40 text-[#66FCF1] text-xs font-mono font-medium flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sync Topology</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 pt-4 flex-wrap">
          <button
            onClick={() => setActiveTab('topology')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all duration-300 border ${
              activeTab === 'topology'
                ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/10'
                : 'bg-[#121822] text-[#94A3B8] border-slate-700/60 hover:text-white hover:border-slate-600'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>cTrader 5-Slot Solution Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all duration-300 border ${
              activeTab === 'ecosystem'
                ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/10'
                : 'bg-[#121822] text-[#94A3B8] border-slate-700/60 hover:text-white hover:border-slate-600'
            }`}
          >
            <Globe className="w-4 h-4 text-[#66FCF1]" />
            <span>🌐 Trinity Network Topology & VPS</span>
          </button>

          <button
            onClick={() => setActiveTab('sentinels')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all duration-300 border ${
              activeTab === 'sentinels'
                ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/10'
                : 'bg-[#121822] text-[#94A3B8] border-slate-700/60 hover:text-white hover:border-slate-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Risk Sentinels & VETO (Chronos / Hades)</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all duration-300 border ${
              activeTab === 'hardware'
                ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/10'
                : 'bg-[#121822] text-[#94A3B8] border-slate-700/60 hover:text-white hover:border-slate-600'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Node Hardware & PM2 Clusters</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VISUAL TOPOLOGY DIAGRAM */}
      {activeTab === 'topology' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Main Visual Routing Card */}
          <div className="bg-[#0B0C10] rounded-xl border border-slate-800 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#66FCF1]/70 to-transparent" />

            {/* Central Master Node: cTrader Open API */}
            <div className="max-w-2xl mx-auto mb-8 text-center">
              <div className="inline-block p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1F2833] to-[#121822] border-2 border-[#66FCF1]/60 shadow-xl shadow-[#66FCF1]/10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#66FCF1] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                  Broker Core Hub
                </div>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <div className="h-10 w-10 rounded-xl bg-[#66FCF1]/20 flex items-center justify-center text-[#66FCF1]">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                      cTrader Open API Server
                    </h3>
                    <div className="text-xs font-mono text-[#66FCF1] flex items-center gap-1.5">
                      <span>Protocol FIX / Protobuf v2</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-400 font-semibold">Strict Limit: 5 TCP Connections</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-slate-300 gap-4">
                  <span>Authorized Slots: <strong>5 / 5</strong></span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 Connection Spills
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Splitter: 5 DIRECT + 1 GATEWAY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Branch: Direct Execution Engines (Slots 1, 2, 3, 4, 5) */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#121822]/90 border border-[#10B981]/40 shadow-lg">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#10B981] animate-ping" />
                    <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      5 Slot-uri Directe cTrader
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    ZERO HOP LATENCY (7-13ms)
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Fiecare bot de execuție critică deține propriul socket TCP dedicat direct către serverul cTrader pentru viteză maximă de umplere a ordinelor.
                </p>

                <div className="space-y-2.5">
                  {[
                    { slot: 'Slot #1', id: 'alpha', name: 'ALPHA (Sniper)', desc: 'Whale >1.80x • ADX>35 • Execuție M15', lat: '11ms', port: 'cTrader Direct Socket 1' },
                    { slot: 'Slot #2', id: 'beta', name: 'BETA (Trend)', desc: 'Pullback EMA20/50 • Trailing Stop', lat: '13ms', port: 'cTrader Direct Socket 2' },
                    { slot: 'Slot #3', id: 'gamma', name: 'GAMMA (Scalp)', desc: 'M1 Micro-Wave Scalper • Rapid TP', lat: '7ms', port: 'cTrader Direct Socket 3' },
                    { slot: 'Slot #4', id: 'epsilon', name: 'EPSILON (Liquidity)', desc: 'Sweep & Absorption Reversal Engine', lat: '12ms', port: 'cTrader Direct Socket 4' },
                    { slot: 'Slot #5', id: 'sergiu', name: 'SERGIU (Flagship)', desc: 'London/NY ORB Breakout Core Master', lat: '10ms', port: 'cTrader Direct Socket 5' },
                  ].map((bot) => (
                    <div 
                      key={bot.id} 
                      className="p-3 rounded-lg bg-[#0B0C10] border border-slate-800 hover:border-[#10B981]/50 transition-all flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-semibold">
                          {bot.slot}
                        </span>
                        <div>
                          <div className="text-white font-bold">{bot.name}</div>
                          <div className="text-[10px] text-slate-500">{bot.desc}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#10B981] font-bold">{bot.lat}</div>
                        <div className="text-[9px] text-slate-500">RTT Direct</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Branch: Gateway Multi-Channel Fan-Out (Slot #5 multiplexed / Shared Context) */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#121822]/90 border border-[#66FCF1]/40 shadow-lg">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#66FCF1] animate-ping" />
                    <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      Trinity Gateway Service
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#66FCF1]/15 text-[#66FCF1] border border-[#66FCF1]/30">
                    MULTIPLEX FAN-OUT HUB
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Un singur nod Gateway consumă stream-ul de tick-uri și redistribuie prin IPC de mare viteză către cele 5 noduri Shadow & Sentinele de Risc, eliminând limitarea brokerului.
                </p>

                {/* Gateway Hub Card */}
                <div className="p-3 mb-3 rounded-lg bg-[#1F2833]/70 border border-[#66FCF1]/40 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#66FCF1]" />
                    <span className="text-[#66FCF1] font-bold">gateway_service.py</span>
                  </div>
                  <span className="text-slate-300 text-[11px]">Broker FIX Handshake Active • 18ms</span>
                </div>

                {/* 5 Shadow Nodes Multiplexed */}
                <div className="space-y-2.5">
                  {[
                    { id: 'zeus', name: 'ZEUS (Macro)', role: 'Gateway Consumer', desc: 'DXY & US10Y Yield correlation signals', lat: '22ms', type: 'cyan' },
                    { id: 'ares', name: 'ARES (Shock)', role: 'Gateway Consumer', desc: 'ATR 2.5x spike detector & rapid hedge', lat: '20ms', type: 'cyan' },
                    { id: 'hermes', name: 'HERMES (News)', role: 'Gateway Consumer', desc: 'CPI / NFP Z-score noise isolation', lat: '24ms', type: 'cyan' },
                    { id: 'chronos', name: 'CHRONOS (Time Veto)', role: 'Circuit Breaker', desc: 'Spread & Rollover block window', lat: '5ms', type: 'amber' },
                    { id: 'hades', name: 'HADES (COT VETO)', role: 'Circuit Breaker', desc: 'Weekly spec positioning sentiment guard', lat: '8ms', type: 'amber' },
                  ].map((bot) => (
                    <div 
                      key={bot.id} 
                      className={`p-3 rounded-lg bg-[#0B0C10] border ${
                        bot.type === 'amber' ? 'border-[#F59E0B]/30 hover:border-[#F59E0B]/60' : 'border-slate-800 hover:border-[#66FCF1]/50'
                      } transition-all flex items-center justify-between gap-3 text-xs font-mono`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          bot.type === 'amber' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 'bg-[#66FCF1]/15 text-[#66FCF1]'
                        }`}>
                          {bot.role}
                        </span>
                        <div>
                          <div className="text-white font-bold">{bot.name}</div>
                          <div className="text-[10px] text-slate-500">{bot.desc}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`${bot.type === 'amber' ? 'text-[#F59E0B]' : 'text-[#66FCF1]'} font-bold`}>
                          {bot.lat}
                        </div>
                        <div className="text-[9px] text-slate-500">IPC Inter-Process</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Explanation Box */}
            <div className="mt-8 p-4 rounded-xl bg-[#121822]/90 border border-slate-700/60 text-xs font-mono text-slate-400">
              <div className="text-white font-bold mb-1 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                De ce această arhitectură oferă un avantaj competitiv indiscutabil?
              </div>
              <p className="leading-relaxed">
                Platforma cTrader limitează orice cont la 5 sesiuni API concomitente. O echipă tradițională de quant este forțată să ruleze doar 5 boți sau să execute cu întârziere prin REST API. Arhitectura Trinity Fund alocă socket-urile directe celor 5 boți de acțiune ultra-rapidă (Alpha, Beta, Gamma, Epsilon, Sergiu), în timp ce Gateway-ul agregat hrănește analitica macro și mecanismele de Veto cu latențe sub-25ms.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB: TRINITY NETWORK TOPOLOGY & VPS SUBDOMAINS */}
      {activeTab === 'ecosystem' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EcosystemTopology />
        </motion.div>
      )}

      {/* TAB 2: SENTINELS & VETO STATUS */}
      {activeTab === 'sentinels' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chronos Sentinel Card */}
            <div className="p-5 rounded-xl bg-[#1F2833]/80 backdrop-blur-md border border-[#F59E0B]/40 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">CHRONOS SENTINEL</h3>
                    <p className="text-[11px] text-[#94A3B8]">Time & Rollover Guardian</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold">
                  STATUS: ARMED
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0B0C10] border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Spread Gold:</span>
                    <span className="text-[#10B981] font-bold">1.4 pips (Normal, Max permis: 3.5 pips)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">VETO Rollover Window:</span>
                    <span className="text-amber-400 font-bold">21:55:00 - 22:15:00 EET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next VETO Event:</span>
                    <span className="text-white">Daily Rollover (peste ~6 ore)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Circuit Breaker Action:</span>
                    <span className="text-[#66FCF1]">Respinge automat orice ordin BUY/SELL nou</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Chronos previne executarea tranzacțiilor în momentele când brokerul lărgește artificial spread-ul pe XAUUSD până la 15-20 de pips la ora 22:00 EET.
                </p>
              </div>
            </div>

            {/* Hades Sentinel Card */}
            <div className="p-5 rounded-xl bg-[#1F2833]/80 backdrop-blur-md border border-[#F59E0B]/40 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B]">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">HADES SENTINEL</h3>
                    <p className="text-[11px] text-[#94A3B8]">CFTC COT Extreme Sentiment Guardian</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold">
                  STATUS: PASS (NO VETO)
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0B0C10] border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Managed Money Net Long:</span>
                    <span className="text-[#10B981] font-bold">62.4% (Prag Veto: &gt; 90.0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ultimul Raport CFTC:</span>
                    <span className="text-white">Vineri, 23:30 EET (Actualizat)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sentiment Overcrowded:</span>
                    <span className="text-[#10B981] font-bold">FALS (Piață echilibrată)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">VETO Trigger:</span>
                    <span className="text-slate-400">Dezactivat (Ordinele BUY au undă verde)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Hades protejează capitalul fondului împotriva capcanelor de lichidare macro când marile fonduri speculative de hedging devin unilateral aglomerate pe aur.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: HARDWARE & PM2 CLUSTERS */}
      {activeTab === 'hardware' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#1F2833]/80 border border-slate-700/60 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] block">OS Loop Integrity</span>
              <span className="text-lg font-bold text-[#10B981] flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" /> 100% Responsive
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Linux 6.6.0-generic x86_64</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1F2833]/80 border border-slate-700/60 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] block">Total Fleet RAM</span>
              <span className="text-lg font-bold text-[#66FCF1] mt-1 block">
                1,498 MB / 8,192 MB
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">18.3% Total Utilization</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1F2833]/80 border border-slate-700/60 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] block">PM2 Managed Processes</span>
              <span className="text-lg font-bold text-white mt-1 block">
                10 Online • 0 Restarts
              </span>
              <span className="text-[10px] text-[#10B981] mt-1 block">Cluster Uptime: 48h 12m</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1F2833]/80 border border-slate-700/60 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] block">IPC Network Latency</span>
              <span className="text-lg font-bold text-[#66FCF1] mt-1 block">
                0.24 ms Loopback
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Zero packet drops</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
