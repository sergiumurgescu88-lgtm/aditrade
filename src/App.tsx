import React, { useState, useEffect, useCallback, Component, ReactNode, ErrorInfo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Cpu, 
  Lock, 
  Layers, 
  Zap, 
  Clock, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Eye, 
  ArrowRight,
  Sliders,
  Database,
  HeartPulse,
  RefreshCw,
  Check,
  Server,
  Radio,
  FileCode2,
  HardDrive,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Sidebar, NavViewId } from './components/Layout/Sidebar.tsx';
import { Header } from './components/Layout/Header.tsx';
import { BotMatrix } from './components/Dashboard/BotMatrix.tsx';
import { LiveTerminal } from './components/Dashboard/LiveTerminal.tsx';
import { SystemHealth } from './components/Dashboard/SystemHealth.tsx';
import { Performance } from './components/Dashboard/Performance.tsx';
import { Pricing } from './components/Dashboard/Pricing.tsx';
import { useAuth } from './hooks/useAuth.ts';
import { useUserProfile } from './hooks/useUserProfile.ts';
import { AuthGateOverlay } from './components/Common/AuthGateOverlay.tsx';
import { AIChatbot } from './components/Common/AIChatbot.tsx';
import { MacroNewsFeed } from './components/Dashboard/MacroNewsFeed.tsx';
import { TradingViewChart } from './components/Dashboard/TradingViewChart.tsx';

interface BotSpec {
  id: string;
  name: string;
  codename: string;
  category: 'direct' | 'gateway' | 'sentinel';
  timeframe: string;
  whaleThreshold: string;
  triggerLogic: string;
  executionMode: string;
  adxRequirement?: string;
  scoreRequirement?: string;
  status: 'ACTIVE' | 'SENTINEL_ARMED' | 'STANDBY';
  riskProfile: string;
  notes: string;
  filePaths: string;
}

const BOTS_REGISTRY: BotSpec[] = [
  {
    id: 'alpha',
    name: 'ALPHA',
    codename: 'Sniper',
    category: 'direct',
    timeframe: 'Multi-TF (H1 / M30 / M15 / M1)',
    whaleThreshold: '> 1.80x Volume Burst',
    triggerLogic: 'Confluence on multi-timeframes with institutional volume surge',
    executionMode: 'DIRECT EXECUTION',
    adxRequirement: '> 35 (Strong Trend Direction)',
    scoreRequirement: '> 85 / 100 Multi-TF Score',
    status: 'ACTIVE',
    riskProfile: 'Ultra High Precision',
    notes: 'Primary ultra-sniper bot targeting confirmed liquidity imbalances on gold pairs.',
    filePaths: 'alpha-sniper/gold_bot.py, strategy_engine_sniper.py'
  },
  {
    id: 'beta',
    name: 'BETA',
    codename: 'Trend',
    category: 'direct',
    timeframe: 'M15 / H1 Trend Ride',
    whaleThreshold: '> 1.49x Volume Burst',
    triggerLogic: 'EMA 20/50 dynamic pullback during established macro impulse',
    executionMode: 'DIRECT EXECUTION',
    adxRequirement: '> 35 (Sustained Momentum)',
    scoreRequirement: 'EMA 20/50 Cross Confirmed',
    status: 'ACTIVE',
    riskProfile: 'Trend Following',
    notes: 'Rides core structural trends with dynamic trailing stops and ATR expansion.',
    filePaths: 'beta-trend/gold_bot.py, strategy_engine_trend.py'
  },
  {
    id: 'gamma',
    name: 'GAMMA',
    codename: 'Scalper',
    category: 'direct',
    timeframe: 'M1 / M5 Fast Cycle',
    whaleThreshold: '> 1.30x Micro Volume',
    triggerLogic: 'Immediate orderbook imbalance and quick liquidity snatching',
    executionMode: 'DIRECT EXECUTION',
    adxRequirement: 'Adaptive Micro Momentum',
    scoreRequirement: 'Ultra-fast TP (3-8 pips)',
    status: 'ACTIVE',
    riskProfile: 'High Frequency',
    notes: 'Micro-scalp engine designed for lightning fills and rapid TP lock-in.',
    filePaths: 'gamma-scalp/gold_bot.py, strategy_engine_scalp.py'
  },
  {
    id: 'epsilon',
    name: 'EPSILON',
    codename: 'Liquidity Hunter',
    category: 'direct',
    timeframe: 'M15 / M30 Swing Points',
    whaleThreshold: '> 1.40x Liquidity Flush',
    triggerLogic: 'Sweep of key session highs/lows followed by aggressive rejection',
    executionMode: 'DIRECT EXECUTION',
    adxRequirement: 'Reversal Confirmation',
    scoreRequirement: 'Sweep Depth > 1.2 ATR',
    status: 'ACTIVE',
    riskProfile: 'Mean Reversion',
    notes: 'Exploits fakeouts and trapped retail stops at institutional liquidity pools.',
    filePaths: 'epsilon-liquidity/gold_bot.py, strategy_engine_sniper.py'
  },
  {
    id: 'sergiu',
    name: 'SERGIU',
    codename: 'Flagship Core',
    category: 'direct',
    timeframe: 'London & NY Openings',
    whaleThreshold: '> 1.50x Session Open Flow',
    triggerLogic: 'Opening Range Breakout (ORB) aligned with session directional bias',
    executionMode: 'DIRECT EXECUTION',
    adxRequirement: '> 25 (Baseline Expansion)',
    scoreRequirement: 'ORB 15m Range Confirmation',
    status: 'ACTIVE',
    riskProfile: 'Institutional Flagship',
    notes: 'Trinity Fund flagship strategy capitalizing on London & New York liquidity peaks.',
    filePaths: 'sergiu-flagship/gold_bot.py'
  },
  {
    id: 'zeus',
    name: 'ZEUS',
    codename: 'Macro Swing',
    category: 'gateway',
    timeframe: 'Daily (D1) / Weekly',
    whaleThreshold: 'Institutional Cross-Asset Flow',
    triggerLogic: 'DXY (US Dollar Index) & TIPS yield inverse correlation pullback',
    executionMode: 'GATEWAY SERVICE',
    adxRequirement: 'Macro Regime Confirmed',
    scoreRequirement: 'Macro Alignment > 75%',
    status: 'ACTIVE',
    riskProfile: 'Macro Correlation',
    notes: 'Dispatches high-probability structural swings routed through shared Gateway.',
    filePaths: 'next-gen/shared/gateway_service.py (Zeus Module)'
  },
  {
    id: 'ares',
    name: 'ARES',
    codename: 'Volatility Shock',
    category: 'gateway',
    timeframe: 'M15 Dynamic Impulse',
    whaleThreshold: 'Shock Spike Flow',
    triggerLogic: 'Sudden unscheduled move exceeding > 2.5x M15 ATR',
    executionMode: 'GATEWAY SERVICE',
    adxRequirement: 'Explosion Velocity Filter',
    scoreRequirement: 'ATR Ratio > 2.5',
    status: 'ACTIVE',
    riskProfile: 'Volatility Spike',
    notes: 'Captures shockwaves and post-cascade institutional rebalancing.',
    filePaths: 'next-gen/shared/gateway_service.py (Ares Module)'
  },
  {
    id: 'hermes',
    name: 'HERMES',
    codename: 'News Catalyst',
    category: 'gateway',
    timeframe: 'T+15m Post-Release',
    whaleThreshold: 'Event Liquidity Absorption',
    triggerLogic: 'Economic Z-Score deviation (Forecast vs Actual) at T+15m mark',
    executionMode: 'GATEWAY SERVICE',
    adxRequirement: 'Post-Noise Stabilization',
    scoreRequirement: 'Z-Score StdDev > 2.0',
    status: 'ACTIVE',
    riskProfile: 'Event Alpha',
    notes: 'Recent fix deployed: avoids initial 0-14m chaotic whip; enters with clean Z-Score alpha.',
    filePaths: 'next-gen/shared/gateway_service.py (Hermes Engine)'
  },
  {
    id: 'chronos',
    name: 'CHRONOS',
    codename: 'Time Guardian',
    category: 'sentinel',
    timeframe: 'Continuous Schedule Sentinel',
    whaleThreshold: 'N/A (System Veto)',
    triggerLogic: 'LBMA Gold Fixing window & 22:00 RO Market Rollover veto lock',
    executionMode: 'IMMEDIATE VETO',
    adxRequirement: 'Full Trade Block',
    scoreRequirement: 'Spread Spike Shield',
    status: 'SENTINEL_ARMED',
    riskProfile: 'Risk Veto & Cutoff',
    notes: 'Absolute veto authority. Prevents trading during toxic spread & rollover hours.',
    filePaths: 'next-gen/shared/sentinels/chronos.py'
  },
  {
    id: 'hades',
    name: 'HADES',
    codename: 'COT Sentinel',
    category: 'sentinel',
    timeframe: 'Weekly Commitment of Traders (COT)',
    whaleThreshold: 'Institutional Crowding > 90%',
    triggerLogic: 'Hedge Fund net long/short positioning at extreme percentile',
    executionMode: 'MACRO VETO',
    adxRequirement: 'Exhaustion Filter',
    scoreRequirement: 'COT Percentile > 90%',
    status: 'SENTINEL_ARMED',
    riskProfile: 'Macro Positioning Veto',
    notes: 'Blocks entries against crowded macro positioning to prevent black swan squeezes.',
    filePaths: 'next-gen/shared/sentinels/hades.py'
  }
];

interface BotHeartbeat {
  id: string;
  name: string;
  codename: string;
  category: 'direct' | 'gateway' | 'sentinel';
  pm2Id: number;
  pid: number;
  latencyMs: number;
  status: 'ALIVE' | 'PINGING' | 'SLOW';
  lastPingTime: string;
  uptime: string;
  cpuPct: number;
  memMb: number;
  history: number[];
}

const INITIAL_HEARTBEATS: BotHeartbeat[] = [
  { id: 'alpha', name: 'ALPHA', codename: 'Sniper', category: 'direct', pm2Id: 0, pid: 24190, latencyMs: 11, status: 'ALIVE', lastPingTime: '0.3s ago', uptime: '14d 6h', cpuPct: 1.2, memMb: 142.8, history: [12, 10, 14, 11, 11] },
  { id: 'beta', name: 'BETA', codename: 'Trend', category: 'direct', pm2Id: 1, pid: 24192, latencyMs: 13, status: 'ALIVE', lastPingTime: '0.3s ago', uptime: '14d 6h', cpuPct: 0.9, memMb: 138.4, history: [14, 15, 12, 13, 13] },
  { id: 'gamma', name: 'GAMMA', codename: 'Scalper', category: 'direct', pm2Id: 2, pid: 24195, latencyMs: 7, status: 'ALIVE', lastPingTime: '0.2s ago', uptime: '14d 6h', cpuPct: 2.1, memMb: 156.1, history: [8, 7, 9, 6, 7] },
  { id: 'epsilon', name: 'EPSILON', codename: 'Liquidity Hunter', category: 'direct', pm2Id: 3, pid: 24198, latencyMs: 12, status: 'ALIVE', lastPingTime: '0.4s ago', uptime: '14d 6h', cpuPct: 1.4, memMb: 145.0, history: [11, 13, 14, 10, 12] },
  { id: 'sergiu', name: 'SERGIU', codename: 'Flagship Core', category: 'direct', pm2Id: 4, pid: 24201, latencyMs: 10, status: 'ALIVE', lastPingTime: '0.3s ago', uptime: '14d 6h', cpuPct: 1.8, memMb: 162.7, history: [10, 12, 11, 9, 10] },
  { id: 'zeus', name: 'ZEUS', codename: 'Macro Swing', category: 'gateway', pm2Id: 5, pid: 24210, latencyMs: 22, status: 'ALIVE', lastPingTime: '0.5s ago', uptime: '14d 6h', cpuPct: 0.6, memMb: 184.2, history: [21, 24, 20, 23, 22] },
  { id: 'ares', name: 'ARES', codename: 'Volatility Shock', category: 'gateway', pm2Id: 6, pid: 24213, latencyMs: 20, status: 'ALIVE', lastPingTime: '0.5s ago', uptime: '14d 6h', cpuPct: 0.8, memMb: 178.5, history: [19, 22, 21, 18, 20] },
  { id: 'hermes', name: 'HERMES', codename: 'News Catalyst', category: 'gateway', pm2Id: 7, pid: 24216, latencyMs: 24, status: 'ALIVE', lastPingTime: '0.6s ago', uptime: '14d 6h', cpuPct: 0.7, memMb: 181.9, history: [26, 25, 23, 22, 24] },
  { id: 'chronos', name: 'CHRONOS', codename: 'Time Guardian', category: 'sentinel', pm2Id: 8, pid: 24220, latencyMs: 5, status: 'ALIVE', lastPingTime: '0.2s ago', uptime: '14d 6h', cpuPct: 0.3, memMb: 92.4, history: [6, 5, 5, 4, 5] },
  { id: 'hades', name: 'HADES', codename: 'COT Sentinel', category: 'sentinel', pm2Id: 9, pid: 24223, latencyMs: 8, status: 'ALIVE', lastPingTime: '0.3s ago', uptime: '14d 6h', cpuPct: 0.4, memMb: 104.1, history: [9, 8, 10, 7, 8] },
];

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class InstitutionalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message || 'Eroare flux socket / handshake întrerupt' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Trinity Fund Circuit Breaker] Intercepted runtime error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0C10] text-[#E2E8F0] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-2xl bg-[#1F2833]/90 backdrop-blur-xl border border-[#F59E0B]/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mx-auto shadow-inner shadow-[#F59E0B]/10">
              <AlertTriangle className="w-8 h-8 animate-pulse text-[#F59E0B]" />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 inline-block uppercase tracking-wider">
                CIRCUIT BREAKER GUARD ACTIV
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#E2E8F0] tracking-tight">
                ⚠️ Conexiune la fluxul de date întreruptă. Se încearcă reconectarea...
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Terminalul instituțional Trinity Fund a interceptat o anomalie în fluxul de date pentru a proteja starea boților și execuția carnetului de ordine cTrader.
              </p>
            </div>

            {this.state.errorMessage && (
              <div className="p-3.5 rounded-lg bg-[#0B0C10] border border-slate-800 text-left font-mono text-[11px] text-[#EF4444] break-all">
                <span className="text-slate-500 block mb-1">Diagnostic Log:</span>
                {this.state.errorMessage}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#66FCF1]/10 hover:bg-[#66FCF1]/20 border border-[#66FCF1]/40 text-[#66FCF1] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reconectează Nodul</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-[#94A3B8] text-xs font-mono transition-all duration-300"
              >
                Reîncarcă Terminalul
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function TrinityCommandCenter() {
  const { user, loading: authLoading, loginWithGoogle, logout, isAuthenticated } = useAuth();
  const { profile: userProfile, updateSubscriptionTier } = useUserProfile(user);

  const [currentView, setCurrentView] = useState<NavViewId>('command-center');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedBotId, setSelectedBotId] = useState<string>('alpha');
  const [testCmd, setTestCmd] = useState<string>('alpha-sniper/strategy_engine_sniper.py');
  const [surgicalMarker, setSurgicalMarker] = useState<string>('WHALE_THRESHOLD_RATIO');

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [shouldSimulateError, setShouldSimulateError] = useState<boolean>(false);

  const [heartbeats, setHeartbeats] = useState<BotHeartbeat[]>(INITIAL_HEARTBEATS);
  const [isPingingAll, setIsPingingAll] = useState<boolean>(false);
  const [autoPulse, setAutoPulse] = useState<boolean>(true);
  const [lastPingTimestamp, setLastPingTimestamp] = useState<string>('Live (Auto)');

  type HeartbeatSortKey = 'latency' | 'cpu' | 'name';
  type HeartbeatSortOrder = 'asc' | 'desc';

  const [heartbeatSortKey, setHeartbeatSortKey] = useState<HeartbeatSortKey>('latency');
  const [heartbeatSortOrder, setHeartbeatSortOrder] = useState<HeartbeatSortOrder>('asc');

  const handleToggleHeartbeatSort = (key: HeartbeatSortKey) => {
    if (heartbeatSortKey === key) {
      setHeartbeatSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setHeartbeatSortKey(key);
      setHeartbeatSortOrder(key === 'cpu' ? 'desc' : 'asc');
    }
  };

  const sortedHeartbeats = [...heartbeats].sort((a, b) => {
    let diff = 0;
    if (heartbeatSortKey === 'latency') {
      diff = a.latencyMs - b.latencyMs;
    } else if (heartbeatSortKey === 'cpu') {
      diff = a.cpuPct - b.cpuPct;
    } else if (heartbeatSortKey === 'name') {
      diff = a.name.localeCompare(b.name);
    }
    return heartbeatSortOrder === 'asc' ? diff : -diff;
  });

  // Initial simulated load: demonstrates elegant skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingData(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  const handleSyncData = useCallback(() => {
    setIsLoadingData(true);
    pingNodes();
    setTimeout(() => {
      setIsLoadingData(false);
    }, 700);
  }, []);

  const pingNodes = useCallback((targetBotId?: string) => {
    if (targetBotId) {
      setHeartbeats(prev => prev.map(bot => {
        if (bot.id === targetBotId) {
          const baseLat = bot.category === 'sentinel' ? 5 : bot.category === 'gateway' ? 21 : 11;
          const jitter = Math.floor(Math.random() * 8) - 3;
          const newLatency = Math.max(3, baseLat + jitter);
          const newHistory = [...bot.history.slice(1), newLatency];
          return {
            ...bot,
            latencyMs: newLatency,
            status: 'ALIVE',
            lastPingTime: 'Just now',
            history: newHistory,
          };
        }
        return bot;
      }));
    } else {
      setIsPingingAll(true);
      setHeartbeats(prev => prev.map(b => ({ ...b, status: 'PINGING' })));

      setTimeout(() => {
        setHeartbeats(prev => prev.map(bot => {
          const baseLat = bot.category === 'sentinel' ? 5 : bot.category === 'gateway' ? 21 : 11;
          const jitter = Math.floor(Math.random() * 8) - 3;
          const newLatency = Math.max(3, baseLat + jitter);
          const newHistory = [...bot.history.slice(1), newLatency];
          return {
            ...bot,
            latencyMs: newLatency,
            status: 'ALIVE',
            lastPingTime: 'Just now',
            history: newHistory,
          };
        }));
        setIsPingingAll(false);
        setLastPingTimestamp(new Date().toLocaleTimeString());
      }, 350);
    }
  }, []);

  useEffect(() => {
    if (!autoPulse) return;
    const interval = setInterval(() => {
      setHeartbeats(prev => prev.map(bot => {
        const baseLat = bot.category === 'sentinel' ? 5 : bot.category === 'gateway' ? 21 : 11;
        const jitter = Math.floor(Math.random() * 6) - 2;
        const newLatency = Math.max(3, baseLat + jitter);
        const newHistory = [...bot.history.slice(1), newLatency];
        return {
          ...bot,
          latencyMs: newLatency,
          lastPingTime: 'Just now',
          history: newHistory,
        };
      }));
      setLastPingTimestamp(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPulse]);

  const selectedBot = BOTS_REGISTRY.find(b => b.id === selectedBotId) || BOTS_REGISTRY[0];

  const getPageInfo = () => {
    switch (currentView) {
      case 'command-center':
        return {
          title: 'Command Center',
          subtitle: 'Fleet status, liveliness telemetry & pipeline topology'
        };
      case 'bot-matrix':
        return {
          title: 'Bot Matrix Engine',
          subtitle: 'Multi-TF parameters, whale thresholds & strategy dossiers'
        };
      case 'live-terminal':
        return {
          title: 'Live Terminal & Injection',
          subtitle: 'Surgical diff runner, backup verifier & audit logs'
        };
      case 'system-health':
        return {
          title: 'System Health & Sentinels',
          subtitle: 'Thread monitoring, circuit breakers & Vibe Coding protocol'
        };
      case 'performance':
        return {
          title: 'Institutional Performance',
          subtitle: 'Audited returns, Sharpe 7.12 & real-time capital equity curve'
        };
      case 'pricing':
        return {
          title: 'Pricing & VIP Access',
          subtitle: 'Institutional copy trading, VIP signals & proprietary licenses'
        };
      default:
        return { title: 'Trinity Fund', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();

  if (shouldSimulateError) {
    throw new Error('Anomalie critică interceptată: cTrader FIX protocol socket timeout pe srv1595784');
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E2E8F0] flex font-sans selection:bg-[#66FCF1]/20 selection:text-[#66FCF1]">
      {/* 1. Sidebar Component */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenMobile={() => setMobileMenuOpen(true)}
      />

      {/* 2. Main Layout Column */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        {/* Header Component */}
        <Header
          currentTitle={title}
          currentSubtitle={subtitle}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onQuickRefresh={handleSyncData}
          isRefreshing={isLoadingData || isPingingAll}
          user={user}
          loadingAuth={authLoading}
          onLogin={loginWithGoogle}
          onLogout={logout}
          userProfile={userProfile}
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            {/* VIEW 1: COMMAND CENTER */}
            {currentView === 'command-center' && (
              <motion.div
                key="command-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Top Metrics Row with Staggered Fade-in Motion */}
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08 }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="bg-[#1F2833]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-[#94A3B8] mb-2">
                      <span className="text-xs uppercase tracking-wider font-mono">Live Fleet</span>
                      <Activity className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#E2E8F0]">10 Bots Live</div>
                    <div className="mt-1 text-xs text-[#10B981] flex items-center gap-1 font-mono">
                      <span>5 Direct • 3 Gateway • 2 Sentinels</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="bg-[#1F2833]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-[#94A3B8] mb-2">
                      <span className="text-xs uppercase tracking-wider font-mono">Whale Calibrations</span>
                      <Zap className="w-4 h-4 text-[#66FCF1]" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#E2E8F0]">1.30x – 1.80x</div>
                    <div className="mt-1 text-xs text-[#66FCF1] flex items-center gap-1 font-mono">
                      <span>Dynamic volume expansion guards</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="bg-[#1F2833]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-[#94A3B8] mb-2">
                      <span className="text-xs uppercase tracking-wider font-mono">Risk Veto Protection</span>
                      <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#E2E8F0]">2 Active Sentinels</div>
                    <div className="mt-1 text-xs text-[#F59E0B] flex items-center gap-1 font-mono">
                      <span>Chronos (22:00 RO/LBMA) + Hades (COT)</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="bg-[#1F2833]/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-[#94A3B8] mb-2">
                      <span className="text-xs uppercase tracking-wider font-mono">Vibe Coding Safety</span>
                      <Lock className="w-4 h-4 text-[#66FCF1]" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#E2E8F0]">100% Enforced</div>
                    <div className="mt-1 text-xs text-[#66FCF1]/90 flex items-center gap-1 font-mono">
                      <span>Read-Only • Backup .bak • Surgical diff</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Live Institutional TradingView Real-Time Chart (XAUUSD) */}
                <div className="my-6 sm:my-8 w-full">
                  <TradingViewChart />
                </div>

              {/* Heartbeat Status Section */}
              <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#66FCF1]/0 via-[#66FCF1]/60 to-[#66FCF1]/0" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1] shadow-inner shadow-[#66FCF1]/10">
                      <HeartPulse className="w-5 h-5 animate-pulse text-[#66FCF1]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#E2E8F0] flex items-center gap-2">
                          Fleet Heartbeat & Process Telemetry
                        </h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
                          10/10 NODES RESPONSIVE
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Simulated IPC ping responses verifying OS process loop and event-thread integrity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => setAutoPulse(!autoPulse)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all duration-300 border ${
                        autoPulse
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-[#121822] border-slate-700 text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${autoPulse ? 'bg-[#10B981] animate-pulse' : 'bg-slate-500'}`} />
                      <span>Auto-Pulse: {autoPulse ? 'ON (4s)' : 'PAUSED'}</span>
                    </button>

                    <button
                      onClick={() => pingNodes()}
                      disabled={isPingingAll}
                      className="px-3 py-1.5 rounded-md bg-[#66FCF1]/15 hover:bg-[#66FCF1]/25 border border-[#66FCF1]/40 text-[#66FCF1] text-xs font-mono font-medium flex items-center gap-1.5 transition-all duration-300 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isPingingAll ? 'animate-spin text-[#66FCF1]' : 'text-[#66FCF1]'}`} />
                      <span>{isPingingAll ? 'Pinging All...' : 'Ping All Nodes'}</span>
                    </button>

                    <button
                      onClick={handleSyncData}
                      disabled={isLoadingData}
                      className="px-2.5 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all duration-300 border bg-[#121822] border-slate-700 text-[#94A3B8] hover:text-[#66FCF1] hover:border-[#66FCF1]/40 disabled:opacity-50"
                      title="Simulează încărcarea cu Skeleton Shimmer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-[#66FCF1]' : ''}`} />
                      <span>{isLoadingData ? 'Shimmer Sync...' : 'Test Skeleton'}</span>
                    </button>
                  </div>
                </div>

                {/* Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 rounded-lg bg-[#121822]/90 border border-slate-700/50 text-xs font-mono">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Fleet Status</span>
                    <span className="text-[#10B981] font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 10 / 10 Alive
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Avg Fleet Latency</span>
                    <span className="text-[#E2E8F0] font-semibold">
                      {(heartbeats.reduce((acc, b) => acc + b.latencyMs, 0) / heartbeats.length).toFixed(1)} ms
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Fastest Node</span>
                    <span className="text-[#66FCF1] font-semibold">
                      CHRONOS (5 ms)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Last Heartbeat</span>
                    <span className="text-[#E2E8F0]">{lastPingTimestamp}</span>
                  </div>
                </div>

                {/* Sortable Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-3 p-2.5 rounded-lg bg-[#121822]/95 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400 font-medium">SORT NODES BY:</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-[#66FCF1] border border-slate-700">
                      {heartbeatSortKey === 'latency' ? 'Latency (Round-Trip)' : heartbeatSortKey === 'cpu' ? 'CPU Thread Load' : 'Bot Name (A-Z)'}
                      {' • '}
                      {heartbeatSortOrder === 'asc' ? 'Ascending (▲)' : 'Descending (▼)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleToggleHeartbeatSort('latency')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all duration-300 border ${
                        heartbeatSortKey === 'latency'
                          ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/15'
                          : 'bg-[#0B0C10] text-[#94A3B8] border-slate-700 hover:text-[#E2E8F0] hover:border-slate-600'
                      }`}
                      title="Sort by Round-Trip Ping Latency"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#66FCF1]" />
                      <span>Latency</span>
                      {heartbeatSortKey === 'latency' ? (
                        heartbeatSortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#66FCF1]" /> : <ArrowDown className="w-3 h-3 text-[#66FCF1]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleHeartbeatSort('cpu')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all duration-300 border ${
                        heartbeatSortKey === 'cpu'
                          ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/15'
                          : 'bg-[#0B0C10] text-[#94A3B8] border-slate-700 hover:text-[#E2E8F0] hover:border-slate-600'
                      }`}
                      title="Sort by CPU Process Usage"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#66FCF1]" />
                      <span>CPU Usage</span>
                      {heartbeatSortKey === 'cpu' ? (
                        heartbeatSortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#66FCF1]" /> : <ArrowDown className="w-3 h-3 text-[#66FCF1]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleHeartbeatSort('name')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all duration-300 border ${
                        heartbeatSortKey === 'name'
                          ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/40 shadow-sm shadow-[#66FCF1]/15'
                          : 'bg-[#0B0C10] text-[#94A3B8] border-slate-700 hover:text-[#E2E8F0] hover:border-slate-600'
                      }`}
                      title="Sort Alphabetically by Bot Name"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#66FCF1]" />
                      <span>Name (A-Z)</span>
                      {heartbeatSortKey === 'name' ? (
                        heartbeatSortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#66FCF1]" /> : <ArrowDown className="w-3 h-3 text-[#66FCF1]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Grid of 10 nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {sortedHeartbeats.map(bot => {
                    const isPinging = bot.status === 'PINGING';
                    return (
                      <div
                        key={bot.id}
                        className="bg-[#121822]/90 rounded-lg p-3 border border-slate-700/60 hover:border-[#66FCF1]/40 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                              </span>
                              <span className={`font-mono text-xs font-bold ${
                                heartbeatSortKey === 'name' ? 'text-[#66FCF1]' : 'text-[#E2E8F0]'
                              }`}>
                                {bot.name}
                              </span>
                            </div>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                              bot.category === 'direct' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' :
                              bot.category === 'gateway' ? 'bg-[#66FCF1]/10 text-[#66FCF1] border-[#66FCF1]/30' :
                              'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                            }`}>
                              {bot.category}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#94A3B8] mb-2 truncate">
                            {bot.codename}
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                            <span className={heartbeatSortKey === 'cpu' ? 'text-[#66FCF1] font-bold' : 'text-slate-400'}>
                              CPU: {bot.cpuPct}%
                            </span>
                            <span className="text-slate-500">
                              pm2:#{bot.pm2Id} • {bot.memMb}MB
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <div className="flex items-baseline justify-between mb-1.5">
                            <div className="flex items-baseline gap-1">
                              <span className={`text-base font-bold font-mono ${
                                isPinging ? 'text-[#F59E0B]' : heartbeatSortKey === 'latency' ? 'text-[#66FCF1]' : 'text-slate-200'
                              }`}>
                                {isPinging ? '...' : `${bot.latencyMs}ms`}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">RTT</span>
                            </div>

                            <button
                              onClick={() => pingNodes(bot.id)}
                              className="text-[10px] font-mono text-[#94A3B8] hover:text-[#66FCF1] px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all duration-300"
                            >
                              Ping
                            </button>
                          </div>

                          <div className="flex items-end gap-1 h-3 pt-0.5">
                            {bot.history.map((val, idx) => {
                              const heightPct = Math.min(100, Math.max(25, (val / 30) * 100));
                              return (
                                <div
                                  key={idx}
                                  className={`flex-1 rounded-[1px] transition-all duration-300 ${
                                    idx === bot.history.length - 1 ? 'bg-[#66FCF1]' : 'bg-[#66FCF1]/30'
                                  }`}
                                  style={{ height: `${heightPct}%` }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-Time Macro-Economic News Feed (Contextual sentinel justifications) */}
              <MacroNewsFeed />

              {/* Bot Matrix - Core 10 Bot Grid Component */}
              <BotMatrix 
                onSelectBot={(id) => { setSelectedBotId(id); setCurrentView('bot-matrix'); }} 
                isLoading={isLoadingData} 
              />

              {/* Core Pipeline Architecture Card */}
              <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
                  <div>
                    <h2 className="text-lg font-bold text-[#E2E8F0] flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#66FCF1]" />
                      Trinity Fund Core Pipeline Architecture
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Execution routes, order gateways, and circuit-breaker veto sentinels.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded bg-[#121822] text-[#E2E8F0] font-mono border border-slate-700/60">
                      Host: srv1595784
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] font-mono border border-[#10B981]/30">
                      PM2 Orchestrated
                    </span>
                  </div>
                </div>

                {/* 3 Tier Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                  {/* Tier 1 */}
                  <div className="bg-[#121822]/90 rounded-lg p-4 border border-slate-700/50 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                      <h3 className="text-sm font-bold text-[#E2E8F0] uppercase tracking-wide">
                        Tier 1: Direct Execution (5)
                      </h3>
                    </div>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Ultra-low latency execution directly on exchange orderbook via dedicated strategy engines.
                    </p>
                    <div className="space-y-2.5">
                      {BOTS_REGISTRY.filter(b => b.category === 'direct').map(bot => (
                        <div 
                          key={bot.id}
                          onClick={() => { setSelectedBotId(bot.id); setCurrentView('bot-matrix'); }}
                          className="p-2.5 rounded bg-[#1F2833]/90 border border-slate-700/60 hover:border-[#66FCF1]/50 cursor-pointer transition-all duration-300 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#E2E8F0] font-mono flex items-center gap-1.5">
                              <span>{bot.name}</span>
                              <span className="text-[#94A3B8] font-normal">({bot.codename})</span>
                            </div>
                            <div className="text-[11px] text-[#94A3B8] mt-0.5">{bot.whaleThreshold}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#66FCF1]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="bg-[#121822]/90 rounded-lg p-4 border border-slate-700/50 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-2 w-2 rounded-full bg-[#66FCF1]" />
                      <h3 className="text-sm font-bold text-[#E2E8F0] uppercase tracking-wide">
                        Tier 2: Gateway Routed (3)
                      </h3>
                    </div>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Coordinated via <code className="text-[11px] text-[#66FCF1] font-mono">gateway_service.py</code> with cross-asset data aggregation.
                    </p>
                    <div className="space-y-2.5">
                      {BOTS_REGISTRY.filter(b => b.category === 'gateway').map(bot => (
                        <div 
                          key={bot.id}
                          onClick={() => { setSelectedBotId(bot.id); setCurrentView('bot-matrix'); }}
                          className="p-2.5 rounded bg-[#1F2833]/90 border border-slate-700/60 hover:border-[#66FCF1]/50 cursor-pointer transition-all duration-300 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#E2E8F0] font-mono flex items-center gap-1.5">
                              <span>{bot.name}</span>
                              <span className="text-[#94A3B8] font-normal">({bot.codename})</span>
                            </div>
                            <div className="text-[11px] text-[#66FCF1]/90 mt-0.5">{bot.triggerLogic}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="bg-[#121822]/90 rounded-lg p-4 border border-slate-700/50 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                      <h3 className="text-sm font-bold text-[#E2E8F0] uppercase tracking-wide">
                        Tier 3: Sentinel Vetoes (2)
                      </h3>
                    </div>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Hard risk blockers that override execution logic during high-risk macro and time windows.
                    </p>
                    <div className="space-y-2.5">
                      {BOTS_REGISTRY.filter(b => b.category === 'sentinel').map(bot => (
                        <div 
                          key={bot.id}
                          onClick={() => { setSelectedBotId(bot.id); setCurrentView('bot-matrix'); }}
                          className="p-2.5 rounded bg-[#1F2833]/90 border border-rose-900/50 hover:border-[#EF4444]/60 cursor-pointer transition-all duration-300 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#EF4444] font-mono flex items-center gap-1.5">
                              <span>{bot.name}</span>
                              <span className="text-[#94A3B8] font-normal">({bot.codename})</span>
                            </div>
                            <div className="text-[11px] text-[#94A3B8] mt-0.5">{bot.triggerLogic}</div>
                          </div>
                          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Log Stream Section for Streamers / Quant Operators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                    <span>Real-Time pm2 stream output</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Host: srv1595784 / stream_logs.sh
                  </span>
                </div>
                <LiveTerminal />
              </div>
            </motion.div>
          )}

          {/* VIEW 2: BOT MATRIX */}
          {currentView === 'bot-matrix' && (
            <motion.div
              key="bot-matrix"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Responsive Bot Matrix Grid */}
              <BotMatrix onSelectBot={(id) => setSelectedBotId(id)} isLoading={isLoadingData} />

              {/* Selected Bot Deep Dossier */}
              <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1]">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#E2E8F0] font-mono flex items-center gap-2">
                        <span>DETAILED DOSSIER: {selectedBot.name}</span>
                        <span className="text-[#94A3B8] text-sm font-sans font-normal">/ {selectedBot.codename}</span>
                      </h2>
                      <p className="text-xs text-[#94A3B8]">{selectedBot.riskProfile}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded border ${
                      selectedBot.category === 'direct' 
                        ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' 
                        : selectedBot.category === 'gateway'
                        ? 'bg-[#66FCF1]/15 text-[#66FCF1] border-[#66FCF1]/30'
                        : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                    }`}>
                      {selectedBot.executionMode}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#121822] border border-slate-700 text-[#94A3B8]">
                      Status: {selectedBot.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-700/50">
                    <div className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#66FCF1]" />
                      Timeframe & Loop
                    </div>
                    <div className="text-sm font-mono text-[#E2E8F0] font-medium">{selectedBot.timeframe}</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-700/50">
                    <div className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#66FCF1]" />
                      Whale Volume Threshold
                    </div>
                    <div className="text-sm font-mono text-[#66FCF1] font-semibold">{selectedBot.whaleThreshold}</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-700/50">
                    <div className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-[#66FCF1]" />
                      ADX & Momentum Filter
                    </div>
                    <div className="text-sm font-mono text-[#E2E8F0] font-medium">{selectedBot.adxRequirement || 'N/A'}</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#121822]/90 border border-slate-700/50">
                    <div className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#66FCF1]" />
                      Scoring Parameter
                    </div>
                    <div className="text-sm font-mono text-[#E2E8F0] font-medium">{selectedBot.scoreRequirement || 'Adaptive'}</div>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1">
                      Trigger & Signal Architecture
                    </h4>
                    <p className="text-sm text-[#E2E8F0] leading-relaxed font-mono">
                      {selectedBot.triggerLogic}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1">
                      CTO Engineering Dossier
                    </h4>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      {selectedBot.notes}
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-lg bg-[#121822]/90 border border-slate-700/60 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                  <span>Associated Files:</span>
                  <span className="text-[#66FCF1]">{selectedBot.filePaths}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: LIVE TERMINAL */}
          {currentView === 'live-terminal' && (
            <motion.div
              key="live-terminal"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* 1. Live Quant Terminal (pm2 logs stream simulator) */}
              <LiveTerminal />

              {/* 2. Surgical Injection & Verification Console */}
              <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-6 shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700/60">
                  <div className="p-2.5 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 text-[#66FCF1]">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#E2E8F0]">
                      Surgical Injection & Verification Console
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Testează și inspectează fluxul standard de Vibe Coding pentru scripturile Trinity Fund.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                      Target File (Relativ la Trinity Fund root)
                    </label>
                    <input
                      type="text"
                      value={testCmd}
                      onChange={(e) => setTestCmd(e.target.value)}
                      className="w-full bg-[#121822] border border-slate-700/70 rounded-lg px-3 py-2 text-xs font-mono text-[#66FCF1] focus:outline-none focus:border-[#66FCF1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                      Surgical Marker / Parameter Anchor
                    </label>
                    <input
                      type="text"
                      value={surgicalMarker}
                      onChange={(e) => setSurgicalMarker(e.target.value)}
                      className="w-full bg-[#121822] border border-slate-700/70 rounded-lg px-3 py-2 text-xs font-mono text-[#66FCF1] focus:outline-none focus:border-[#66FCF1]"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                    Standard Vibe Coding Protocol Sequence Generated:
                  </div>

                  <div className="bg-[#0B0C10] p-4 rounded-lg border border-slate-800 font-mono text-xs text-[#E2E8F0] space-y-3">
                    <div className="text-slate-500"># 1. READ-ONLY FIRST: Verificăm contextul și numărul de linii</div>
                    <div className="text-[#10B981] bg-[#121822] p-2 rounded border border-slate-700/60">
                      grep -n -C 5 "{surgicalMarker}" /root/trinity-fund/{testCmd}
                    </div>

                    <div className="text-slate-500"># 2. BACKUP AUTOMAT: Creăm copie de siguranță .bak</div>
                    <div className="text-[#F59E0B] bg-[#121822] p-2 rounded border border-slate-700/60">
                      cp /root/trinity-fund/{testCmd} /root/trinity-fund/{testCmd}.bak
                    </div>

                    <div className="text-slate-500"># 3. INJECȚIE CHIRURGICALĂ: Modificăm strict parametrul țintă</div>
                    <div className="text-[#66FCF1] bg-[#121822] p-2 rounded border border-slate-700/60">
                      python3 -c "import re; f='/root/trinity-fund/{testCmd}'; content=open(f).read(); ..."
                    </div>

                    <div className="text-slate-500"># 4. VERIFICARE POST-INJECȚIE: Validare sintactică & grep</div>
                    <div className="text-[#E2E8F0] bg-[#121822] p-2 rounded border border-slate-700/60">
                      python3 -m py_compile /root/trinity-fund/{testCmd} && grep -n "{surgicalMarker}" /root/trinity-fund/{testCmd}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 4: SYSTEM HEALTH */}
          {currentView === 'system-health' && (
            <motion.div
              key="system-health"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Comprehensive System Health & cTrader Topology Solution */}
              <SystemHealth onRefresh={handleSyncData} isLoading={isLoadingData} />

              {/* Vibe Coding 5 Rules Constitution */}
              <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-6 shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700/60">
                  <div className="p-2.5 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 text-[#66FCF1]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#E2E8F0]">
                      Protocolul Oficial de Vibe Coding – Trinity Fund (Secțiunea 5)
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Reguli obligatorii pentru fiecare modificare de cod, injecție de parametri sau refactorizare.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#66FCF1] uppercase">Regula 1</span>
                        <Eye className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#E2E8F0] mb-1">Read-Only First</h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Mereu verifică structura și conținutul exact al fișierului înainte de a propune sau efectua modificări.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#66FCF1] uppercase">Regula 2</span>
                        <Cpu className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#E2E8F0] mb-1">Injecție Chirurgicală</h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Folosește markeri exacți pentru a înlocui doar liniile sau componentele vizate, fără a rescrie strategii intacte.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase">Regula 3</span>
                        <Database className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#E2E8F0] mb-1">Backup Automat</h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Orice script creează automat un fișier <code className="text-[#F59E0B]">.bak</code> înainte de a scrie modificarea pe disc.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#EF4444] uppercase">Regula 4</span>
                        <Lock className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#E2E8F0] mb-1">Fără Expunere (Zero Secret Exposure)</h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Nu genera sau imprima niciodată fișierele <code className="text-[#EF4444]">.env</code>, bazele <code className="text-[#EF4444]">.sqlite</code> sau cheile API.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#121822]/90 border border-slate-700/50 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#10B981] uppercase">Regula 5</span>
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#E2E8F0] mb-1">Verificare Post-Injecție</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    După fiecare modificare, oferă o comandă de verificare (de ex: <code className="text-[#66FCF1] font-mono">python3 -m py_compile target.py</code> sau <code className="text-[#66FCF1] font-mono">pm2 logs --lines 20</code>).
                  </p>
                </div>
              </div>

              {/* Circuit Breaker & Error Boundary Guard Card */}
              <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-[#F59E0B]/30 p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#E2E8F0]">
                        Institutional Error Boundary & Circuit Breaker Guard
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        Protecție fail-safe automată pentru interfață și fluxurile cTrader FIX / PM2.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      ACTIVE & ARMED
                    </span>
                    <button
                      onClick={() => setShouldSimulateError(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono transition-all duration-300 flex items-center gap-1.5"
                      title="Testează ecranul elegant de Error Boundary"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Testează Circuit Breaker</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#121822] border border-slate-700/50">
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Interfață Fallback</span>
                    <span className="text-[#E2E8F0] font-medium">Auto-Recovery UI</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#121822] border border-slate-700/50">
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Interceptare Erori</span>
                    <span className="text-[#10B981] font-medium">Zero App Crash</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#121822] border border-slate-700/50">
                    <span className="text-[#94A3B8] block text-[10px] uppercase">Reconectare</span>
                    <span className="text-[#66FCF1] font-medium">One-Click Resync</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 5: PERFORMANCE & TRACK RECORD */}
          {currentView === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <AuthGateOverlay
                isAuthenticated={isAuthenticated}
                onLogin={loginWithGoogle}
                isLoading={authLoading}
                title="Conectează-te pentru a accesa datele live și auditul de performanță"
                subtitle="Raportul complet Myfxbook, detaliile tranzacțiilor pe secundă și curba de capital sunt accesibile utilizatorilor înregistrați."
              >
                <Performance />
              </AuthGateOverlay>
            </motion.div>
          )}

          {/* VIEW 6: PRICING & SALES FUNNEL */}
          {currentView === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <AuthGateOverlay
                isAuthenticated={isAuthenticated}
                onLogin={loginWithGoogle}
                isLoading={authLoading}
                title="Conectează-te pentru a accesa datele live și abonamentele VIP"
                subtitle="Activează copierea automată cTrader Copy sau accesează semnalele algoritmice directe ale flotei Trinity Fund."
              >
                <Pricing
                  userProfile={userProfile}
                  onNavigateToCommandCenter={() => setCurrentView('command-center')}
                  onUpgradeTier={updateSubscriptionTier}
                />
              </AuthGateOverlay>
            </motion.div>
          )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/90 bg-[#0B0C10] py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span className="text-[#E2E8F0]">TRINITY FUND • INSTITUTIONAL COMMAND CENTER</span>
            </div>
            <div>
              <span>Layout Shell: Bloomberg &times; Vercel Glassmorphism</span>
            </div>
          </div>
        </footer>

        {/* Global Floating AI Contextual Assistant (Trinity AI Support) */}
        <AIChatbot />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <InstitutionalErrorBoundary>
      <TrinityCommandCenter />
    </InstitutionalErrorBoundary>
  );
}
