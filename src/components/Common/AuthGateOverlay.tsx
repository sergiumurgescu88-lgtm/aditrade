import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface AuthGateOverlayProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthGateOverlay: React.FC<AuthGateOverlayProps> = ({
  isAuthenticated,
  onLogin,
  isLoading = false,
  children,
  title = "Conectează-te pentru a accesa datele live și abonamentele VIP",
  subtitle = "Acces securizat prin Firebase Auth și sincronizare criptată a conturilor cTrader Copy.",
}) => {
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred & partially opaque background content */}
      <div className="pointer-events-none select-none filter blur-[5px] opacity-40 transition-all duration-300">
        {children}
      </div>

      {/* Locked Glassmorphism Modal / Overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#0B0C10]/90 backdrop-blur-xl border border-[#66FCF1]/40 shadow-2xl shadow-[#66FCF1]/10 text-center space-y-5"
        >
          {/* Lock Icon with animated pulse */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1] shadow-lg shadow-[#66FCF1]/20">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>TRINITY FUND • SAAS GATEWAY</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] font-sans leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Login Action Button */}
          <div className="pt-2">
            <button
              onClick={onLogin}
              disabled={isLoading}
              className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#66FCF1] hover:bg-[#52e5d9] text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#66FCF1]/25 hover:shadow-[#66FCF1]/40 transition-all duration-300 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Se conectează...' : 'Conectare Rapidă (Mock Demo)'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-1">
            Autentificare simulată instantanee • Testează starea Logat vs Nelogat
          </div>
        </motion.div>
      </div>
    </div>
  );
};
