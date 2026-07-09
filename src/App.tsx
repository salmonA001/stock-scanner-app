import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BackgroundGlows } from './components/BackgroundGlows';
import { StockSelector } from './components/StockSelector';
import { AgentCard } from './components/AgentCard';
import { AgentCustomizer } from './components/AgentCustomizer';
import { ConsensusDashboard } from './components/ConsensusDashboard';
import { BacktestPerformance } from './components/BacktestPerformance';
import { getStockData, calculateConsensus } from './utils/mockData';
import type { AgentWeights, StockDetails, AgentDecision, BacktestDataPoint } from './types/stock';
import { TrendingUp, TrendingDown, Layers, Cpu, Radio } from 'lucide-react';

export const App: React.FC = () => {
  // Init states
  const [weights, setWeights] = useState<AgentWeights>({
    valuation: 20,
    technicals: 20,
    fundamentals: 20,
    sentiment: 20,
    risk: 20
  });

  const [ticker, setTicker] = useState<string>('NVDA');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAgentIdx, setActiveAgentIdx] = useState<number>(-1);
  const [scannedAgents, setScannedAgents] = useState<string[]>([]);
  
  // Data states
  const [stockDetails, setStockDetails] = useState<StockDetails | null>(null);
  const [agentsDecisions, setAgentsDecisions] = useState<AgentDecision[]>([]);
  const [backtestData, setBacktestData] = useState<BacktestDataPoint[]>([]);

  // Load default stock (NVDA) on mount with simulated scan
  useEffect(() => {
    handleScan('NVDA');
  }, []);

  const handleScan = (targetTicker: string) => {
    const symbol = targetTicker.toUpperCase();
    setTicker(symbol);
    setIsLoading(true);
    setScannedAgents([]);
    setActiveAgentIdx(0);

    // Fetch the data from generator beforehand so we can simulate the agents scanning it
    const { details, agents, backtest } = getStockData(symbol);

    // Dynamic scanning animation pipeline
    // We scan each of the 5 agents one by one
    let currentIdx = 0;
    const interval = setInterval(() => {
      setScannedAgents(prev => [...prev, agents[currentIdx].id]);
      currentIdx++;
      
      if (currentIdx < agents.length) {
        setActiveAgentIdx(currentIdx);
      } else {
        // All agents scanned!
        clearInterval(interval);
        setActiveAgentIdx(-1);
        setIsLoading(false);
        // Commit values to state
        setStockDetails(details);
        setAgentsDecisions(agents);
        setBacktestData(backtest);
      }
    }, 1000); // 1 second per agent scan
  };

  // Re-calculate consensus whenever decisions or weights update
  const consensusResult = useMemo(() => {
    if (!agentsDecisions.length) return null;
    return calculateConsensus(agentsDecisions, weights);
  }, [agentsDecisions, weights]);

  return (
    <div className="min-h-screen relative flex flex-col z-10">
      {/* Background Ambience */}
      <BackgroundGlows />
      
      {/* Main Navigation */}
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 z-10">
        
        {/* Top Section: Action & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Ticker Search (Left) */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6">
            <StockSelector onScan={handleScan} isLoading={isLoading} />
            
            {/* Asset Status Display Card */}
            {stockDetails && (
              <div className="w-full glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden card-3d">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      {stockDetails.ticker}
                    </span>
                    <h2 className="text-xl font-black text-slate-100 mt-2 tracking-wide">{stockDetails.name}</h2>
                    <p className="text-xs text-slate-400">Equity Asset Class • Live Feeds</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-slate-100 tracking-tight glow-indigo">
                      ${stockDetails.price.toFixed(2)}
                    </div>
                    <div className={`text-sm font-bold flex items-center justify-end gap-1 mt-1 ${
                      stockDetails.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {stockDetails.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{stockDetails.changePercent >= 0 ? '+' : ''}{stockDetails.changePercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5 text-center">
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Market Cap</span>
                    <span className="text-sm font-mono font-bold text-slate-200">{stockDetails.marketCap}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Volume</span>
                    <span className="text-sm font-mono font-bold text-slate-200">{stockDetails.volume}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">P/E Ratio</span>
                    <span className="text-sm font-mono font-bold text-slate-200">{stockDetails.peRatio}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Day Range</span>
                    <span className="text-[11px] font-mono font-bold text-slate-200 block truncate" title={`$${stockDetails.low} - $${stockDetails.high}`}>
                      ${stockDetails.low} - ${stockDetails.high}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weight customizer (Right) */}
          <div className="lg:col-span-7 w-full">
            <AgentCustomizer weights={weights} onWeightsChange={setWeights} />
          </div>
        </div>

        {/* Dynamic Scanning Status Bar */}
        {isLoading && (
          <div className="w-full glass-panel-glow border-indigo-500/20 p-5 rounded-2xl flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-indigo-400 animate-spin" />
              <div>
                <h3 className="font-bold text-sm text-indigo-200 uppercase tracking-widest font-mono">Consensus pipeline executing</h3>
                <p className="text-xs text-slate-400">Synthesizing agent signals for {ticker}...</p>
              </div>
            </div>
            
            {/* Step progress pills */}
            <div className="flex gap-2">
              {['Valuation', 'Technicals', 'Fundamentals', 'Sentiment', 'Risk'].map((name, i) => {
                const isDone = scannedAgents.length > i;
                const isCurrent = activeAgentIdx === i;
                return (
                  <div 
                    key={name} 
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase transition-all duration-300 border ${
                      isDone 
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                        : isCurrent
                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300 animate-pulse'
                        : 'bg-slate-950/60 border-white/5 text-slate-600'
                    }`}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Consensus Dashboard (Synthesis Output) */}
        {!isLoading && consensusResult && (
          <ConsensusDashboard consensus={consensusResult} ticker={ticker} />
        )}

        {/* Scanning Pipeline Visualization (Decorative flow charts) */}
        {!isLoading && agentsDecisions.length > 0 && (
          <div className="w-full relative py-2">
            <div className="flex items-center justify-between text-slate-500 text-xs px-2 mb-2 font-mono uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1.5"><Radio className="w-4 h-4 text-indigo-400" /> Analyst Nodes</span>
              <span>Portfolio Hub Consensus</span>
            </div>
            {/* Flow line SVGs connecting agents grid to PM dashboard could be visualized by design layout below */}
          </div>
        )}

        {/* Five Analyst Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* We generate cards for all 5 agents */}
          {/* Even during scanning, we want to render them so they can show 'scanning' indicator or static states */}
          {agentsDecisions.length > 0 ? (
            agentsDecisions.map((agent, i) => {
              const weightVal = weights[agent.id as keyof AgentWeights] || 0;
              const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0);
              const relativeWeight = totalWeights > 0 ? weightVal / totalWeights : 0;
              
              const isAgentActive = activeAgentIdx === i;
              const isAgentScanned = scannedAgents.includes(agent.id) || !isLoading;

              return (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  weight={relativeWeight}
                  isActive={isAgentActive}
                  isScanned={isAgentScanned}
                />
              );
            })
          ) : (
            // Empty skeleton grid placeholder
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="w-full h-44 rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-xl animate-pulse flex items-center justify-center text-xs text-slate-600 font-mono uppercase tracking-widest">
                Agent Offline
              </div>
            ))
          )}
        </div>

        {/* Bottom Section: Performance Charts */}
        {!isLoading && backtestData.length > 0 && (
          <BacktestPerformance data={backtestData} />
        )}

      </main>

      <footer className="w-full glass-panel border-t border-white/10 py-6 mt-16 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 APEX Algorithmic Fund Simulator. Designed with premium Glassmorphism & 3D dynamics.</span>
        <div className="flex items-center gap-1.5 text-indigo-400 font-mono">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Multi-Agent Consensus Protocol v1.4</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
