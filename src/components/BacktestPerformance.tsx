import React, { useState, useMemo } from 'react';
import type { BacktestDataPoint } from '../types/stock';
import { LineChart, Calendar } from 'lucide-react';

interface BacktestPerformanceProps {
  data: BacktestDataPoint[];
}

export const BacktestPerformance: React.FC<BacktestPerformanceProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Chart dimensions
  const width = 600;
  const height = 240;
  const padding = 40;

  // Calculate scales
  const points = useMemo(() => {
    if (!data.length) return [];
    
    // Find min and max for scaling
    let minVal = Infinity;
    let maxVal = -Infinity;
    data.forEach(d => {
      minVal = Math.min(minVal, d.portfolio, d.sp500);
      maxVal = Math.max(maxVal, d.portfolio, d.sp500);
    });

    // Add a bit of padding to top and bottom
    const range = maxVal - minVal;
    const yMin = Math.max(0, minVal - range * 0.1);
    const yMax = maxVal + range * 0.1;

    // Map each point to SVG coordinates
    const scaleX = (idx: number) => padding + (idx / (data.length - 1)) * (width - padding * 2);
    const scaleY = (val: number) => height - padding - ((val - yMin) / (yMax - yMin)) * (height - padding * 2);

    return data.map((d, idx) => ({
      ...d,
      x: scaleX(idx),
      yPort: scaleY(d.portfolio),
      ySp: scaleY(d.sp500)
    }));
  }, [data, width, height]);

  // Construct SVG paths
  const paths = useMemo(() => {
    if (points.length < 2) return { portLine: '', spLine: '', portArea: '' };

    let portLine = `M ${points[0].x} ${points[0].yPort}`;
    let spLine = `M ${points[0].x} ${points[0].ySp}`;

    for (let i = 1; i < points.length; i++) {
      // Linear path
      portLine += ` L ${points[i].x} ${points[i].yPort}`;
      spLine += ` L ${points[i].x} ${points[i].ySp}`;
    }

    // Area path for gradient under portfolio line
    const portArea = `${portLine} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return { portLine, spLine, portArea };
  }, [points, height]);

  // Hover coordinate lookup
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - svgRect.left;
    
    // Calculate which index is closest to xPos
    const chartWidth = width - padding * 2;
    const percentage = (xPos - padding) / chartWidth;
    const estimatedIndex = Math.round(percentage * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(data.length - 1, estimatedIndex));
    
    setHoveredIdx(clampedIndex);
  };

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  // Calculate final gains
  const startPort = data[0]?.portfolio || 100;
  const endPort = data[data.length - 1]?.portfolio || 100;
  const startSp = data[0]?.sp500 || 100;
  const endSp = data[data.length - 1]?.sp500 || 100;

  const portGain = ((endPort - startPort) / startPort) * 100;
  const spGain = ((endSp - startSp) / startSp) * 100;
  const outperformance = portGain - spGain;

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-indigo-500/5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-indigo-400" />
            30-Day Simulated Backtest
          </h2>
          <p className="text-sm text-slate-400">Historical performance of this weighted agent consensus vs the market benchmark.</p>
        </div>

        {/* Stats capsules */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">AI Strategy Gain</span>
            <span className="text-sm font-black font-mono text-indigo-200">+{portGain.toFixed(1)}%</span>
          </div>
          <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">S&P 500 Gain</span>
            <span className="text-sm font-black font-mono text-slate-300">+{spGain.toFixed(1)}%</span>
          </div>
          <div className={`border px-3 py-1.5 rounded-xl text-center ${
            outperformance >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Alpha</span>
            <span className="text-sm font-black font-mono">
              {outperformance >= 0 ? '+' : ''}{outperformance.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {/* Portfolio Gradient Area Fill */}
            <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
            </linearGradient>
            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines (horizontal) */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

          {/* S&P 500 Path (Dashed Line) */}
          <path
            d={paths.spLine}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Portfolio Area Fill */}
          <path
            d={paths.portArea}
            fill="url(#portGrad)"
            stroke="none"
          />

          {/* Portfolio Path (Glowing Solid Line) */}
          <path
            d={paths.portLine}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="3"
            filter="url(#glow)"
            className="transition-all duration-300"
          />

          {/* Axis Labels (X Axis) */}
          {points.length > 0 && (
            <>
              <text x={padding} y={height - 15} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" className="font-mono">
                {points[0].date}
              </text>
              <text x={width / 2} y={height - 15} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" className="font-mono">
                {points[Math.floor(points.length / 2)].date}
              </text>
              <text x={width - padding} y={height - 15} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" className="font-mono">
                {points[points.length - 1].date}
              </text>
            </>
          )}

          {/* Vertical tracker line on hover */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={padding}
              x2={activePoint.x}
              y2={height - padding}
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Active points circles on lines */}
          {activePoint && (
            <>
              {/* SP 500 dot */}
              <circle
                cx={activePoint.x}
                cy={activePoint.ySp}
                r="4"
                fill="rgb(30, 41, 59)"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1.5"
              />
              {/* Portfolio dot */}
              <circle
                cx={activePoint.x}
                cy={activePoint.yPort}
                r="5"
                fill="rgb(99, 102, 241)"
                stroke="white"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </>
          )}
        </svg>

        {/* Floating HTML tooltip absolute container */}
        {activePoint && (
          <div 
            style={{ 
              left: `${(activePoint.x / width) * 100}%`,
              top: '10%'
            }}
            className="absolute -translate-x-1/2 glass-panel p-3 rounded-xl border border-indigo-500/30 text-xs font-mono flex flex-col gap-1.5 shadow-xl pointer-events-none z-10 animate-fadeIn min-w-[120px]"
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold border-b border-white/5 pb-1">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>{activePoint.date}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-indigo-300 font-bold">Portfolio:</span>
              <span className="text-slate-100 font-black">${activePoint.portfolio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">S&P 500:</span>
              <span className="text-slate-200 font-black">${activePoint.sp500.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/5 pt-1 mt-0.5">
              <span className="text-emerald-400 font-bold">Alpha:</span>
              <span className={`font-black ${activePoint.portfolio >= activePoint.sp500 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {((activePoint.portfolio - activePoint.sp500) / activePoint.sp500 * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-white/5 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-indigo-500 inline-block border-b-2 border-indigo-400" />
          <span className="text-indigo-300">Weighted AI Agent Consensus Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-b border-dashed border-slate-400 inline-block" />
          <span className="text-slate-400">S&P 500 Benchmark Index</span>
        </div>
      </div>
    </div>
  );
};
