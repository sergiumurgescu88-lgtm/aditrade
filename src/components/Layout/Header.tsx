import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Clock, 
  Radio, 
  ShieldCheck,
  Zap,
  RefreshCw,
  LogIn,
  LogOut,
  User as UserIcon,
  Crown
} from 'lucide-react';
import { MockUser } from '../../hooks/useAuth';
import { UserProfile } from '../../hooks/useUserProfile';

interface HeaderProps {
  currentTitle: string;
  currentSubtitle?: string;
  onToggleMobileMenu: () => void;
  onQuickRefresh?: () => void;
  isRefreshing?: boolean;
  user?: MockUser | null;
  loadingAuth?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  userProfile?: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  currentSubtitle,
  onToggleMobileMenu,
  onQuickRefresh,
  isRefreshing = false,
  user,
  loadingAuth = false,
  onLogin,
  onLogout,
  userProfile
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
          className="lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-lg bg-[#1F2833]/80 border border-slate-700/60 text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1F2833] transition-all duration-300 flex items-center justify-center"
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
            className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-lg bg-[#1F2833]/70 hover:bg-[#1F2833] border border-slate-700/60 text-[#94A3B8] hover:text-[#66FCF1] transition-all duration-300 disabled:opacity-50"
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

        {/* Auth / Account Profile Section */}
        {user ? (
          <div className="flex items-center gap-2 pl-1 border-l border-slate-700/60">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-mono font-bold text-white max-w-[120px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <span className="text-[10px] font-mono text-[#66FCF1] flex items-center justify-end gap-1">
                {userProfile?.subscriptionTier === 'COPY_TRADING_PRO' && <Crown className="w-3 h-3 text-[#10B981]" />}
                {userProfile?.subscriptionTier || 'FREE'}
              </span>
            </div>

            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full border border-[#66FCF1]/50 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1F2833] border border-[#66FCF1]/50 flex items-center justify-center text-[#66FCF1] font-mono text-xs font-bold">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-lg bg-[#1F2833]/70 hover:bg-[#EF4444]/20 border border-slate-700/60 text-[#94A3B8] hover:text-[#EF4444] transition-all duration-300"
                title="Deconectare"
                aria-label="Deconectare cont"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          onLogin && (
            <button
              onClick={onLogin}
              disabled={loadingAuth}
              className="min-h-[44px] px-3 sm:px-4 py-2 rounded-lg bg-[#1F2833]/90 hover:bg-[#66FCF1]/10 border border-[#66FCF1]/50 text-[#66FCF1] hover:text-white transition-all duration-300 text-xs font-mono font-bold flex items-center gap-2 shadow-md hover:shadow-[#66FCF1]/20 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-[#66FCF1]" />
              <span className="hidden sm:inline">Login / Sign Up</span>
              <span className="sm:hidden">Login</span>
            </button>
          )
        )}
      </div>
    </header>
  );
};
