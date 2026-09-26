import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Send, 
  MessageSquare, 
  Server, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  ArrowRight, 
  CreditCard,
  Building2,
  Lock,
  ExternalLink,
  X
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  ctaAction: string;
  tagline: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'signals-vip',
    name: 'Signals VIP',
    price: '49€',
    period: '/lună',
    description: 'Acces la semnalele brute în timp real pentru traderii independenți care doresc execuție manuală.',
    tagline: 'Ideal pentru conturi începătoare sau învățare',
    features: [
      'Alerte Telegram în timp real (execuție < 1 secundă)',
      'Analiză macro zilnică și sinteză știri COT & DXY',
      'Acces exclusiv în comunitatea privată Discord / Telegram',
      'Configurații detaliate de Stop Loss și Take Profit pe pips',
      'Rapoarte săptămânale de performanță'
    ],
    ctaLabel: 'Join VIP',
    ctaAction: 'signals'
  },
  {
    id: 'copy-trading-pro',
    name: 'Copy Trading Pro',
    price: '199€',
    period: '/lună SAU 25% din Profit',
    description: 'Soluția complet automatizată. Contul tău cTrader replică instant fiecare ordin trimis de cei 10 boți.',
    tagline: 'Soluția recomandată de fond (Zero stres tehnic)',
    badge: 'MOST POPULAR',
    isPopular: true,
    features: [
      'Execuție 100% automată prin cTrader Copy Protocol',
      'Dynamic Lot Sizing (ajustare automată pentru protecția conturilor mici)',
      'Protecție VETO activă împotriva spread-urilor de rollover (Chronos & Hades)',
      'Fără VPS necesar – rulează direct pe infrastructura noastră cloud',
      'Suport tehnic prioritar 1-la-1 prin Telegram / WhatsApp',
      'Opțiune flexibilă: Taxă fixă sau High-Water Mark (25% din profit net)'
    ],
    ctaLabel: 'Start Copying',
    ctaAction: 'copy'
  },
  {
    id: 'institutional-license',
    name: 'Institutional License',
    price: 'Custom',
    period: '/ de la 2.000€+',
    description: 'Licențiere completă pentru prop firms, family offices, administratori de fond sau traderi cu capital mare.',
    tagline: 'Pentru prop firms și capital instituțional',
    features: [
      'Acces direct la Open API & Gateway Service (Protobuf / FIX)',
      'Soluție completă White-Label cu branding propriu',
      'Server dedicat dedicat la Frankfurt LD4 (latență < 1.5ms)',
      'Strategii customizate & calibrare parametri de risc personalizați',
      'Manager de cont dedicat & asistență pentru auditare reglementară',
      'SLA garantat de disponibilitate 99.9%'
    ],
    ctaLabel: 'Contact Sales',
    ctaAction: 'institutional'
  }
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Cum funcționează Dynamic Lot Sizing pentru conturile mici?',
    answer: 'Algoritmul calculează dimensiunea poziției proportional cu soldul efectiv al fiecărui cont conectat. Standardul de bază este de exact 0.01 loturi per fiecare 1.000$ din balanță. Dacă ai un cont de 3.000$, botul va deschide automat 0.03 loturi. În plus, calculul integrează volatilitatea curentă ATR: dacă piața este agitată, mărimea lotului se reduce automat pentru a menține riscul per trade sub 1% din capital.'
  },
  {
    id: 'faq-2',
    question: 'Este sigur să vă conectez contul cTrader?',
    answer: 'Da, 100% sigur. Conexiunea se realizează exclusiv prin intermediul cTrader Copy, protocolul oficial reglementat oferit de brokerul tău (ex: IC Markets, Pepperstone, etc.). Noi nu avem niciodată acces la fondurile tale, nu putem efectua retrageri sau transferuri și nu avem acces la parola ta. Tu deții controlul complet: poți opri copierea sau închide pozițiile în orice secundă din aplicația ta mobilă cTrader.'
  },
  {
    id: 'faq-3',
    question: 'Ce se întâmplă dacă botul are o lună pe pierdere?',
    answer: 'Prioritatea numărul 1 a Trinity Fund este conservarea asimetrică a capitalului. Sistemul are încorporate gardieni de risc hardcoded: circuit breaker zilnic de maxim 1.5% drawdown și limite maxime pe lună de 4.2%. În momentele de toxicitate a pieței sau lichiditate scăzută (orele de rollover bancar, știri NFP extreme), sentinelele Chronos și Hades activează automat modul VETO, blocând tranzacționarea până la revenirea condițiilor normale.'
  }
];

export const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [modalTier, setModalTier] = useState<PricingTier | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#66FCF1]/10 border border-[#66FCF1]/30 text-[#66FCF1] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSTITUTIONAL QUANT ACCESS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          Alege Nivelul Tău de Acces la Flota Trinity Fund
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          Execuție algoritmică de mare viteză pe XAUUSD. Fie că alegi copiere automată sau licență instituțională dedicată, capitalul tău este protejat de aceleași sentinele de risc.
        </p>
      </div>

      {/* 2. Three Horizontal Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-2">
        {PRICING_TIERS.map((tier) => {
          const isPopular = tier.isPopular;

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between backdrop-blur-md transition-all duration-300 ${
                isPopular
                  ? 'bg-gradient-to-b from-[#1F2833]/95 via-[#16212e]/95 to-[#0d141f]/95 border-2 border-[#66FCF1] shadow-2xl shadow-[#66FCF1]/15 md:scale-105 z-10'
                  : 'bg-[#1F2833]/70 border border-slate-700/60 shadow-xl hover:border-slate-600'
              }`}
            >
              {/* Badge for Popular Card */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#66FCF1] text-black text-[11px] font-mono font-bold tracking-wider uppercase shadow-lg shadow-[#66FCF1]/30">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header of Card */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className={`text-xl font-bold font-mono ${isPopular ? 'text-[#66FCF1]' : 'text-white'}`}>
                    {tier.name}
                  </h3>
                  {isPopular && (
                    <span className="p-1 rounded-full bg-[#66FCF1]/20 text-[#66FCF1]">
                      <Zap className="w-4 h-4 fill-[#66FCF1]" />
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 mb-4 font-mono">
                  {tier.tagline}
                </div>

                {/* Price Display */}
                <div className="mb-4 pb-4 border-b border-slate-700/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Ce primești inclus:
                  </div>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#E2E8F0] font-sans">
                      <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                        isPopular ? 'bg-[#66FCF1]/20 text-[#66FCF1]' : 'bg-[#10B981]/20 text-[#10B981]'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setModalTier(tier)}
                  className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                    isPopular
                      ? 'bg-[#66FCF1] hover:bg-[#52e5d9] text-black shadow-[#66FCF1]/25 hover:shadow-lg hover:shadow-[#66FCF1]/35'
                      : 'bg-[#121822] hover:bg-[#1A2330] text-[#E2E8F0] border border-slate-700/80 hover:border-[#66FCF1]/40'
                  }`}
                >
                  <span>{tier.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Safety & Trust Highlights Strip */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#121822]/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#10B981]/15 text-[#10B981]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-bold">Fonduri Non-Custodiale</div>
            <div className="text-[11px] text-slate-400">Banii rămân în contul tău cTrader</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#66FCF1]/15 text-[#66FCF1]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-bold">Latență Sub-15ms</div>
            <div className="text-[11px] text-slate-400">Execuție directă Frankfurt Equinix LD4</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-bold">Circuit Breaker Integrat</div>
            <div className="text-[11px] text-slate-400">Stop loss automat la nivel de flotă</div>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions (FAQ Accordions) */}
      <div className="bg-[#1F2833]/80 backdrop-blur-md rounded-xl border border-slate-700/60 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700/60">
          <HelpCircle className="w-5 h-5 text-[#66FCF1]" />
          <div>
            <h3 className="text-base font-bold font-mono text-white">
              Întrebări Frecvente (FAQ)
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Tot ce trebuie să știi înainte de conectarea contului la sistemul Trinity Fund.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div 
                key={faq.id}
                className="rounded-lg bg-[#121822]/80 border border-slate-700/60 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full min-h-[48px] px-4 py-3 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-mono font-medium text-white hover:text-[#66FCF1] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#66FCF1]">Q:</span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#66FCF1] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                <div 
                  className={`px-4 pb-4 pt-1 text-xs text-[#94A3B8] leading-relaxed font-sans border-t border-slate-800 transition-all ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Direct Connect / Sales Modal */}
      <AnimatePresence>
        {modalTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#121822] border border-[#66FCF1]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#66FCF1]/20 text-[#66FCF1]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold font-mono text-white">
                    Activează {modalTier.name}
                  </h4>
                </div>
                <button
                  onClick={() => setModalTier(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0B0C10] border border-slate-800 space-y-1.5">
                  <div className="text-slate-400">Plan Selectat:</div>
                  <div className="text-lg font-bold text-[#66FCF1]">{modalTier.name} ({modalTier.price})</div>
                  <div className="text-slate-500 text-[11px]">{modalTier.tagline}</div>
                </div>

                <p className="text-slate-300 font-sans leading-relaxed">
                  Pentru activare instantanee sau configurarea contului tău cTrader Copy, contactează direct biroul de trading Trinity Fund:
                </p>

                <div className="space-y-2 pt-1">
                  <a
                    href="https://t.me/TrinityFundQuant"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0088cc] hover:bg-[#0077b5] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Contact Telegram VIP Desk (@TrinityFundQuant)</span>
                  </a>

                  <a
                    href="mailto:sergiu.murgescu88@gmail.com?subject=Trinity%20Fund%20Access%20Request"
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#1F2833] hover:bg-slate-700 text-[#66FCF1] border border-[#66FCF1]/40 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Solicită Integrare cTrader prin Email</span>
                  </a>
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-2">
                  Timp mediu de răspuns: &lt; 15 minute • Conexiune sigură cTrader Open API
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
