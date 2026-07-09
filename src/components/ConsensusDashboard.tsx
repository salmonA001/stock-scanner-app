import React from 'react';
import type { Consensus } from '../types/stock';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, ShieldCheck, Scale } from 'lucide-react';

interface ConsensusDashboardProps {
  consensus: Consensus;
  ticker: string;
}

export const ConsensusDashboard: React.FC<ConsensusDashboardProps> = ({ consensus, ticker }) => {
  const { recommendation, positionSize, rationale, confidence } = consensus;

  const getRecommendationStyle = (rec: typeof recommendation) => {
    switch (rec) {
      case 'BUY':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          glow: 'shadow-[0_0_35px_rgba(16,185,129,0.15)] shadow-emerald-500/10',
          icon: <ArrowUpCircle className="w-10 h-10 text-emerald-400 animate-bounce" />,
          label: 'EXECUTE BUY'
        };
      case 'SELL':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          glow: 'shadow-[0_0_35px_rgba(244,63,94,0.15)] shadow-rose-500/10',
          icon: <ArrowDownCircle className="w-10 h-10 text-rose-400 animate-bounce" />,
          label: 'LIQUIDATE / SELL'
        };
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          glow: 'shadow-[0_0_35px_rgba(245,158,11,0.15)] shadow-amber-500/10',
          icon: <MinusCircle className="w-10 h-10 text-amber-400" />,
          label: 'MAINTAIN HOLD'
        };
    }
  };

  const style = getRecommendationStyle(recommendation);

  // SVG parameters for progress circle
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (positionSize / 100) * circumference;

  return (
    <div className={`w-full glass-panel p-6 rounded-2xl border relative overflow-hidden transition-all duration-500 ${style.bg} ${style.glow}`}>
      {/* Glow decorative strip */}
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${
        recommendation === 'BUY' ? 'from-emerald-500' : recommendation === 'SELL' ? 'from-rose-500' : 'from-amber-500'
      } to-transparent`} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Section: Signal Display */}
        <div className="md:col-span-5 flex flex-col items-center text-center md:items-start md:text-left gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-center gap-3">
            {style.icon}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Consensus recommendation</span>
              <h2 className="text-2xl font-black tracking-wider text-slate-100">{ticker} - {recommendation}</h2>
            </div>
          </div>
          
          <div className="w-full flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-white/5 mt-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Scanned weights</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-200">Dynamic weights applied</span>
          </div>

          <div className="w-full flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Risk limit status</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">APPROVED</span>
          </div>
        </div>

        {/* Center Section: Rationale & Summary */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Portfolio Manager Executive Brief</h3>
          <p className="text-sm text-slate-200 font-medium leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-white/5 shadow-inner">
            {rationale}
          </p>
        </div>

        {/* Right Section: Sizing and Confidence gauges */}
        <div className="md:col-span-3 flex flex-row md:flex-col justify-around items-center gap-4">
          {/* Position Sizing Gauge */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Target Exposure</span>
            <div className="relative flex items-center justify-center">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <circle
                  stroke="rgba(255,255,255,0.05)"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke={recommendation === 'BUY' ? 'rgb(16, 185, 129)' : recommendation === 'SELL' ? 'rgb(244, 63, 94)' : 'rgb(245, 158, 11)'}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black font-mono text-slate-100">{positionSize}%</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Sizing</span>
              </div>
            </div>
          </div>

          {/* Confidence Score Bar */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Decision Confidence</span>
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-black font-mono text-slate-100">{confidence}%</div>
              <div className="w-20 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  className={`h-full rounded-full ${
                    recommendation === 'BUY' ? 'bg-emerald-500' : recommendation === 'SELL' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} 
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
