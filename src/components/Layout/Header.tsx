import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Clock, 
  Radio, 
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  currentTitle: string;
  currentSubtitle?: string;
  onToggleMobileMenu: () => void;
  onQuickRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  currentSubtitle,
  onToggleMobileMenu,
  onQuickRefresh,
  isRefreshing = false
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: HH:mm:ss UTC • YYYY-MM-DD
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const dateStr = now.toISOString().split('T')[0];
      setUtcTime(`${hours}:${minutes}:${seconds} UTC • ${dateStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0B0C10]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-all duration-300">
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[#1F2833]/80 border border-slate-700/60 text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1F2833] transition-all duration-300"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#E2E8F0] font-sans tracking-tight flex items-center gap-2">
            <span>{currentTitle}</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/30">
              TRINITY LIVE
            </span>
          </h1>
          {currentSubtitle && (
            <p className="text-[11px] text-[#94A3B8] font-mono hidden md:block">
              {currentSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: UTC Clock & System Status Badge */}
      <div className="flex items-center gap-3">
        {/* Live UTC Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F2833]/70 border border-slate-700/60 backdrop-blur-sm text-xs font-mono text-[#E2E8F0]">
          <Clock className="w-3.5 h-3.5 text-[#66FCF1]" />
          <span className="tabular-nums tracking-wide">{utcTime || 'Syncing UTC...'}</span>
        </div>

        {/* Quick Refresh Button */}
        {onQuickRefresh && (
          <button
            onClick={onQuickRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-[#1F2833]/70 hover:bg-[#1F2833] border border-slate-700/60 text-[#94A3B8] hover:text-[#66FCF1] transition-all duration-300 disabled:opacity-50"
            title="Refresh fleet telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#66FCF1]' : ''}`} />
          </button>
        )}

        {/* System Status Badge - Required with realistic framer-motion continuous pulse */}
        <motion.div 
          animate={{ 
            boxShadow: [
              '0 0 10px rgba(16, 185, 129, 0.12)',
              '0 0 20px rgba(16, 185, 129, 0.35)',
              '0 0 10px rgba(16, 185, 129, 0.12)'
            ],
            borderColor: [
              'rgba(16, 185, 129, 0.30)',
              'rgba(16, 185, 129, 0.65)',
              'rgba(16, 185, 129, 0.30)'
            ]
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10B981]/10 border text-xs font-mono text-[#10B981]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
          </span>
          <span className="font-medium whitespace-nowrap hidden md:inline">
            SYSTEM ONLINE • cTrader API CONNECTED • UPTIME: 99.9%
          </span>
          <span className="font-medium whitespace-nowrap md:hidden">
            ONLINE • 99.9%
          </span>
        </motion.div>
      </div>
    </header>
  );
};
