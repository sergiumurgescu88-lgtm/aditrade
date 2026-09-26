import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'ai',
    text: 'Salut! Sunt Trinity AI Support 🤖. Cum te pot ajuta astăzi cu privire la algoritmii noștri instituționali, cTrader Copy sau abonamentele VIP?',
    timestamp: 'acum'
  }
];

const SUGGESTED_QUESTIONS = [
  'Cum funcționează Alpha Sniper?',
  'Ce niveluri de preț aveți?',
  'Cum este gestionat riscul?',
  'Care este depozitul minim recomandat?'
];

// Predefined smart responses based on keywords from Trinity Fund Knowledge Base
const getAIResponse = (input: string): string => {
  const query = input.toLowerCase().trim();

  // Alpha / Sniper / ADX
  if (query.includes('alpha') || query.includes('sniper') || query.includes('adx')) {
    return '🎯 Alpha este lunetistul nostru. Cere aliniere perfectă H1/M30/M15/M1 și un volum Whale > 1.8x. Dacă ADX e sub 35, Alpha refuză trade-ul pentru a proteja capitalul.';
  }

  // Preț / Cost / Abonament
  if (
    query.includes('pret') || 
    query.includes('preț') || 
    query.includes('cost') || 
    query.includes('abonament') || 
    query.includes('pricing') ||
    query.includes('tarife')
  ) {
    return '💳 Oferim 3 niveluri: Signals VIP (49€/lună), Copy Trading Pro (199€/lună) și Institutional. Vezi pagina Pricing pentru detalii!';
  }

  // Siguranță / Risc / Chronos / Hades
  if (
    query.includes('siguranta') || 
    query.includes('siguranță') || 
    query.includes('risc') || 
    query.includes('drawdown') || 
    query.includes('protectie') ||
    query.includes('protecție')
  ) {
    return '🛡️ Folosim sentinele precum Chronos (blochează execuția la Rollover) și Hades (analiză COT). Plus, Dynamic Lot Sizing protejează conturile mici.';
  }

  // Beta / Grid / Hedging
  if (query.includes('beta') || query.includes('grid') || query.includes('rebound')) {
    return '⚡ Beta este arhitectul de consolidare (Smart Dynamic Grid). Lucrează exclusiv pe piețe laterale cu micro-hedge dinamic și target strâns de 8-15 pips per leg, decuplându-se automat dacă volatilitatea depășește pragurile ATR.';
  }

  // Gamma / Scalper / Trend
  if (query.includes('gamma') || query.includes('momentum') || query.includes('scalp')) {
    return '🌊 Gamma este motorul de trend & momentum. Exploatează exploziile lichidității din sesiunile Londra și New York (Overlap), folosind trailing stop milimetric pe volum instituțional.';
  }

  // cTrader / Broker / Setup
  if (query.includes('ctrader') || query.includes('broker') || query.includes('setup') || query.includes('instalare')) {
    return '🌐 Conectarea se realizează 100% cloud prin cTrader Copy! Nu ai nevoie de VPS pornit non-stop: execuția se multiplică direct pe serverul brokerului tău prin FIX API la latență de sub 1.2ms.';
  }

  // Depozit minim / Capital
  if (query.includes('depozit') || query.includes('capital') || query.includes('minim') || query.includes('bani')) {
    return '💰 Depozitul minim recomandat este de 500€ pentru planul Copy Trading Pro (cu dimensionare automată de micro-loturi 0.01 prin motorul nostru de Dynamic Lot Sizing).';
  }

  // Track Record / Rezultate / Myfxbook
  if (query.includes('track') || query.includes('rezultat') || query.includes('myfxbook') || query.includes('istoric') || query.includes('profit')) {
    return '📈 Flota Trinity Fund are un Win Rate auditat de 80.2%, un Sharpe Ratio de 7.12 și un Profit Factor de 2.48. Poți consulta raportul complet în secțiunea Performance!';
  }

  // Salut / Bună
  if (query.includes('salut') || query.includes('buna') || query.includes('bună') || query.includes('hello') || query.includes('hi')) {
    return 'Salutare! Cu ce te pot ghida astăzi în ecosistemul Trinity Fund? Îmi poți pune orice întrebare despre botul Alpha, riscuri, conexiunea cTrader sau abonamente.';
  }

  // Default fallback
  return '🤖 Înțeleg! Flota Trinity Fund funcționează cu 3 algoritmi independenți (Alpha Sniper, Beta Rebound, Gamma Momentum) protejați de sentinelele Chronos și Hades. Pentru detalii specifice, întreabă-mă despre "Alpha", "preț", "risc", sau "cTrader".';
};

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate realistic AI thought delay (350ms - 650ms)
    setTimeout(() => {
      const replyText = getAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-[9999] select-none">
      {/* Floating Trigger Button with Subtle Pulse */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative"
        >
          {/* Subtle neon pulse background ring */}
          <span className="absolute -inset-1 rounded-full bg-[#66FCF1]/30 blur-sm animate-pulse" />

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Deschide Trinity AI Support"
            className="relative w-14 h-14 rounded-full bg-[#0B0C10] border-2 border-[#66FCF1] text-[#66FCF1] hover:text-black hover:bg-[#66FCF1] shadow-2xl shadow-[#66FCF1]/30 flex items-center justify-center transition-all duration-300 group cursor-pointer"
          >
            <MessageCircle className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            
            {/* Live Indicator Dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#0B0C10] animate-ping" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#0B0C10]" />
          </button>
        </motion.div>
      )}

      {/* Floating Chat Window (Dark Glassmorphism, 350px x 500px) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[92vw] sm:w-[350px] h-[500px] rounded-2xl bg-[#0B0C10]/95 backdrop-blur-xl border border-[#66FCF1]/40 shadow-2xl shadow-[#66FCF1]/15 flex flex-col overflow-hidden"
          >
            {/* 1. Header */}
            <div className="px-4 py-3 bg-[#121822]/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#66FCF1]/10 border border-[#66FCF1]/30 flex items-center justify-center text-[#66FCF1]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-mono font-bold text-white tracking-wide">
                      TRINITY AI SUPPORT
                    </h4>
                    <span className="px-1.5 py-0.2 rounded bg-[#10B981]/20 text-[#10B981] text-[9px] font-mono font-bold">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">
                    Knowledge Base • cTrader Copier
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Resetează conversația"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Închide chat-ul"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#EF4444] hover:bg-slate-800/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Messages Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs custom-scrollbar">
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 ${isAi ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAi && (
                      <div className="w-6 h-6 rounded-full bg-[#66FCF1]/15 border border-[#66FCF1]/40 flex items-center justify-center text-[#66FCF1] shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-xl px-3 py-2 leading-relaxed text-xs shadow-sm ${
                        isAi
                          ? 'bg-[#18202C] text-[#E2E8F0] border border-slate-700/80 rounded-tl-xs'
                          : 'bg-[#66FCF1] text-black font-medium rounded-tr-xs shadow-[#66FCF1]/10'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[9px] font-mono mt-1 ${
                          isAi ? 'text-slate-500' : 'text-slate-800/80 text-right'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {!isAi && (
                      <div className="w-6 h-6 rounded-full bg-[#1F2833] border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#66FCF1]/15 border border-[#66FCF1]/40 flex items-center justify-center text-[#66FCF1] shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-[#18202C] border border-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. Quick Chips Suggestions */}
            <div className="px-3 py-2 bg-[#0B0C10]/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="shrink-0 px-2 py-1 rounded-full bg-[#121822] hover:bg-[#1A2330] border border-slate-700/60 hover:border-[#66FCF1]/40 text-[10px] font-mono text-slate-300 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* 4. Input Footer */}
            <div className="p-3 bg-[#121822] border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Întreabă despre Alpha, preț, risc..."
                className="flex-1 bg-[#0B0C10] border border-slate-700 focus:border-[#66FCF1] rounded-xl px-3 py-2 text-xs font-sans text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl bg-[#66FCF1] hover:bg-[#52e5d9] disabled:bg-slate-800 text-black disabled:text-slate-600 flex items-center justify-center transition-all shadow-md shadow-[#66FCF1]/20 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Trimite mesaj"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
