import React, { useRef, useState } from 'react';
import type { AgentDecision } from '../types/stock';
import { TrendingUp, TrendingDown, HelpCircle, Award, FileText } from 'lucide-react';

interface AgentCardProps {
  agent: AgentDecision;
  weight: number;
  isActive: boolean; // For animation timing
  isScanned: boolean; // Has this agent scanned yet?
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, weight, isActive, isScanned }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Mouse move tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within element
    const y = e.clientY - rect.top;  // y coordinate within element
    
    // Normalise positions from -0.5 to 0.5
    const xc = ((x / rect.width) - 0.5) * 20; // max 10 degrees tilt
    const yc = -((y / rect.height) - 0.5) * 20;

    setTiltStyle({
      transform: `rotateY(${xc.toFixed(1)}deg) rotateX(${yc.toFixed(1)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.05s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    });
  };

  const getSignalBadge = (signal: typeof agent.signal) => {
    switch (signal) {
      case 'BULLISH':
        return (
          <span className="glass-panel border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.2)] inner-3d-badge">
            <TrendingUp className="w-3.5 h-3.5" />
            BULLISH
          </span>
        );
      case 'BEARISH':
        return (
          <span className="glass-panel border-rose-500/30 bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(244,63,94,0.2)] inner-3d-badge">
            <TrendingDown className="w-3.5 h-3.5" />
            BEARISH
          </span>
        );
      default:
        return (
          <span className="glass-panel border-amber-500/30 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.2)] inner-3d-badge">
            <HelpCircle className="w-3.5 h-3.5" />
            NEUTRAL
          </span>
        );
    }
  };

  const getAgentColor = (signal: typeof agent.signal) => {
    if (!isScanned) return 'border-white/5 bg-slate-900/10 opacity-40';
    if (isActive) return 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_25px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400';
    
    switch (signal) {
      case 'BULLISH':
        return 'border-emerald-500/30 hover:border-emerald-500/50 bg-slate-900/30 hover:shadow-emerald-500/5';
      case 'BEARISH':
        return 'border-rose-500/30 hover:border-rose-500/50 bg-slate-900/30 hover:shadow-rose-500/5';
      default:
        return 'border-amber-500/30 hover:border-amber-500/50 bg-slate-900/30 hover:shadow-amber-500/5';
    }
  };

  return (
    <div className="perspective-1000 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => isScanned && setIsExpanded(!isExpanded)}
        style={tiltStyle}
        className={`w-full p-5 rounded-2xl border transition-all duration-300 preserve-3d cursor-pointer ${getAgentColor(agent.signal)}`}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start gap-2 mb-4 preserve-3d">
          <div className="flex items-center gap-3">
            {/* 3D Looking Avatar Placeholder with Initial */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white border shadow-md ${
              !isScanned 
                ? 'bg-slate-800 border-slate-700'
                : agent.signal === 'BULLISH'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400/30 shadow-emerald-500/10'
                : agent.signal === 'BEARISH'
                ? 'bg-gradient-to-br from-rose-500 to-red-600 border-rose-400/30 shadow-rose-500/10'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/30 shadow-amber-500/10'
            }`}>
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm tracking-wide inner-3d-title">{agent.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{agent.role}</p>
            </div>
          </div>
          
          {isScanned ? getSignalBadge(agent.signal) : (
            <span className="glass-panel border-white/5 bg-white/5 text-slate-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {isActive ? 'Scanning...' : 'Pending'}
            </span>
          )}
        </div>

        {/* Scanning progress overlay */}
        {isActive && !isScanned && (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-xs text-indigo-300 font-mono tracking-widest animate-pulse">ANALYZING ASSET METRICS...</span>
          </div>
        )}

        {/* Scanned Card Body */}
        {isScanned && (
          <div className="flex flex-col gap-4 preserve-3d">
            {/* Confidence & Weight Gauge */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-white/5 p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full ${
                        agent.signal === 'BULLISH' ? 'bg-emerald-500' : agent.signal === 'BEARISH' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} 
                      style={{ width: `${agent.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200">{agent.confidence}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Influence Weight</span>
                <span className="text-sm font-bold text-indigo-300 font-mono">{(weight * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(agent.metrics).slice(0, 3).map(([key, val]) => (
                <div key={key} className="bg-slate-900/50 border border-white/5 p-2 rounded-lg text-center">
                  <span className="text-[9px] text-slate-400 font-semibold block truncate" title={key}>{key}</span>
                  <span className="text-xs font-mono font-bold text-slate-200">{val}</span>
                </div>
              ))}
            </div>

            {/* Tap to expand text */}
            <div className="text-center pt-1 border-t border-white/5 flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300">
              <FileText className="w-3 h-3" />
              <span>{isExpanded ? 'Click to collapse insights' : 'Click to view full analysis'}</span>
            </div>

            {/* Expanded Detailed Log */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-3 animate-fadeIn">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Key Decision Rationales
                  </h4>
                  <ul className="list-none flex flex-col gap-2 pl-0">
                    {agent.rationales.map((rat, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/20 p-2 rounded border border-white/5">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          agent.signal === 'BULLISH' ? 'bg-emerald-500' : agent.signal === 'BEARISH' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        <span>{rat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {Object.keys(agent.metrics).length > 3 && (
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 mb-2">Extended Parameters</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(agent.metrics).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center bg-slate-950/40 p-2 rounded text-xs font-mono">
                          <span className="text-slate-400 text-[10px]">{key}</span>
                          <span className="text-slate-200 font-bold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
