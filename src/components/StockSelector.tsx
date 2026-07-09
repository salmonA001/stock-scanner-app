import React, { useState } from 'react';
import { Search, Flame } from 'lucide-react';

interface StockSelectorProps {
  onScan: (ticker: string) => void;
  isLoading: boolean;
}

const POPULAR_TICKERS = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMZN'];

export const StockSelector: React.FC<StockSelectorProps> = ({ onScan, isLoading }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onScan(ticker.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full glass-panel-glow p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-indigo-500/5">
      {/* Decorative top ambient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-indigo-400" />
            Select Target Asset
          </h2>
          <p className="text-sm text-slate-400">Enter any stock ticker to deploy the multi-agent committee for analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="e.g. AAPL, NVDA, TSLA, BTC..."
              maxLength={8}
              className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-lg font-mono font-bold tracking-widest text-slate-100 placeholder:text-slate-500 placeholder:font-normal placeholder:tracking-normal uppercase"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !ticker.trim()}
            className={`btn-3d px-8 py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transform active:translate-y-[2px] transition-all duration-100 ${
              isLoading || !ticker.trim()
                ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-cyan-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Scanning...</span>
              </>
            ) : (
              <span>Deploy Agents</span>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-white/5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Popular Assets:</span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TICKERS.map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  setTicker(symbol);
                  onScan(symbol);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900/60 border border-white/5 hover:border-indigo-500/35 hover:bg-indigo-950/20 text-slate-300 hover:text-indigo-300 transition duration-150 transform hover:scale-105 active:scale-95"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
