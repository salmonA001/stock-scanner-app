import React from 'react';
import { Activity, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Floating 3D Logo Icon */}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className="relative bg-slate-900 border border-white/20 p-2.5 rounded-lg text-indigo-400 group-hover:text-indigo-300 flex items-center justify-center transform group-hover:translate-y-[-2px] transition duration-300 shadow-md">
            <Activity className="w-6 h-6 animate-pulse-slow" />
          </div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-200 via-cyan-100 to-white bg-clip-text text-transparent">
            ANTIGRAVITY <span className="text-indigo-400 font-extrabold">APEX</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Multi-Agent AI Hedge Fund Simulator</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Connected Indicator */}
        <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/5 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Committee Live</span>
        </div>
        
        {/* Verification Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Secured Sandbox</span>
        </div>
      </div>
    </header>
  );
};
