import React from 'react';
import type { AgentWeights } from '../types/stock';
import { Sliders, RefreshCw, Briefcase, Award } from 'lucide-react';

interface AgentCustomizerProps {
  weights: AgentWeights;
  onWeightsChange: (newWeights: AgentWeights) => void;
}

interface Preset {
  name: string;
  description: string;
  weights: AgentWeights;
}

const PRESETS: Preset[] = [
  {
    name: 'Balanced Fund',
    description: 'Equal weights across all analytical vectors.',
    weights: { valuation: 20, technicals: 20, fundamentals: 20, sentiment: 20, risk: 20 }
  },
  {
    name: 'Warren Buffett',
    description: 'Heavily value & fundamental-driven. Ignores hype.',
    weights: { valuation: 45, technicals: 5, fundamentals: 40, sentiment: 5, risk: 5 }
  },
  {
    name: 'Cathie Wood (ARK)',
    description: 'Growth & momentum-oriented. High sentiment tolerance.',
    weights: { valuation: 10, technicals: 30, fundamentals: 20, sentiment: 35, risk: 5 }
  },
  {
    name: 'Risk-Averse Treasury',
    description: 'Risk manager dominates exposure limits.',
    weights: { valuation: 15, technicals: 10, fundamentals: 15, sentiment: 10, risk: 50 }
  }
];

export const AgentCustomizer: React.FC<AgentCustomizerProps> = ({ weights, onWeightsChange }) => {
  
  const handleSliderChange = (key: keyof AgentWeights, val: number) => {
    onWeightsChange({
      ...weights,
      [key]: val
    });
  };

  const handleReset = () => {
    onWeightsChange({ valuation: 20, technicals: 20, fundamentals: 20, sentiment: 20, risk: 20 });
  };

  // Helper to get total weight for normalization display
  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-indigo-500/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Agent Weight Customizer
          </h2>
          <p className="text-sm text-slate-400">Tweak the influence of individual agents to override consensus logic.</p>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300 transition duration-150 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Preset Cards Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {PRESETS.map((preset) => {
          // Check if current weights match this preset roughly
          const isActive = Object.keys(weights).every(
            (k) => weights[k as keyof AgentWeights] === preset.weights[k as keyof AgentWeights]
          );

          return (
            <button
              key={preset.name}
              onClick={() => onWeightsChange(preset.weights)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-indigo-300'
                  : 'border-white/5 bg-slate-950/40 hover:border-white/10 text-slate-300'
              }`}
            >
              <span className="text-xs font-bold block mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {preset.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block leading-normal line-clamp-2">
                {preset.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slider Controls */}
      <div className="flex flex-col gap-4">
        {(Object.keys(weights) as Array<keyof AgentWeights>).map((key) => {
          const val = weights[key];
          const pct = total > 0 ? (val / total) * 100 : 0;
          
          // Nicer formatting for names
          const label = key.charAt(0).toUpperCase() + key.slice(1) + ' Agent';
          const description = 
            key === 'valuation' ? 'Evaluates asset fair price vs DCF models' :
            key === 'technicals' ? 'Monitors chart patterns, indicators, & signals' :
            key === 'fundamentals' ? 'Checks growth ratios, debt metrics & equity' :
            key === 'sentiment' ? 'Crawls social chatter & news narrative buzz' :
            'Manages beta exposure bounds & caps sizing';

          return (
            <div key={key} className="bg-slate-950/30 border border-white/5 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow max-w-sm">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  {label}
                </span>
                <span className="text-[11px] text-slate-400 leading-normal block">{description}</span>
              </div>
              
              <div className="flex items-center gap-4 flex-grow max-w-md w-full">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5 focus:outline-none"
                />
                <div className="w-20 text-right font-mono text-xs">
                  <span className="font-bold text-indigo-300">{val} pts</span>
                  <span className="text-slate-400 block text-[10px]">({pct.toFixed(0)}% weight)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
