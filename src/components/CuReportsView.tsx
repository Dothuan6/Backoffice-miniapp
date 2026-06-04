import React, { useState } from 'react';
import { CreditCard, Users, Info, TrendingUp, Activity, Pause, Square } from 'lucide-react';
import { SpendEvent, DailyBurn, StrategyActivity } from '../types';

interface CuReportsViewProps {
  totalSpent: number;
  activeUsersCount: number;
  spendEvents: SpendEvent[];
  dailyBurn: DailyBurn[];
  strategyActivities: StrategyActivity[];
}

export default function CuReportsView({
  totalSpent,
  activeUsersCount,
  spendEvents,
  dailyBurn,
  strategyActivities
}: CuReportsViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number; val: DailyBurn } | null>(null);

  // Calculate coordinates for the custom SVG smooth area chart
  // Container box dimensions
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Find max value to scale Y axis
  const maxSpent = Math.max(...dailyBurn.map(d => d.spent));
  
  // Map index & value to coordinates
  const points = dailyBurn.map((d, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / (dailyBurn.length - 1);
    const y = height - paddingY - (d.spent / (maxSpent * 1.1)) * (height - paddingY * 2);
    return { x, y, data: d };
  });

  // Create smooth bezier path string
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Path string closed for background gradient area
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  // Max value for progress bars normalization
  const maxEventSpent = Math.max(...spendEvents.map(e => e.spent));

  return (
    <div className="space-y-6" id="cu-reports-view">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="cu-reports-header">
        <h2 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">CU Usage Overview</h2>
        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-[#121824] px-3 py-1.5 rounded-lg border border-[#1e2638] self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Live reports syncing...
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="cu-reports-top-cards">
        {/* Total Spent Card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5" id="total-spent-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Spent</span>
            </div>
            <Info className="w-4 h-4 text-slate-600 hover:text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Total Spent</span>
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                {totalSpent.toLocaleString()} <span className="text-slate-400 text-lg">CU</span>
              </span>
            </div>
            <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="text-[10px]">↗</span> +14.2% from yesterday
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5" id="active-users-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Active Users</span>
            </div>
            <Info className="w-4 h-4 text-slate-600 hover:text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Active Users</span>
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                {activeUsersCount}
              </span>
            </div>
            {/* Stacked Avatars */}
            <div className="flex items-center -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
                alt="Stack 1"
                className="w-8 h-8 rounded-full border-2 border-[#121824] object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80"
                alt="Stack 2"
                className="w-8 h-8 rounded-full border-2 border-[#121824] object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80"
                alt="Stack 3"
                className="w-8 h-8 rounded-full border-2 border-[#121824] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#121824] text-[10px] font-mono text-slate-300 flex items-center justify-center">
                +829
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="cu-reports-charts-row">
        {/* Daily CU Burn Card (SVG Line Chart) */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 lg:col-span-2 flex flex-col justify-between" id="daily-burn-chart-card">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Daily CU Burn</h3>
              {/* Minimal Legend */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-blue-500 block rounded-full"></span>
                <span className="text-xs text-slate-400 font-mono">Spent</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart Container */}
          <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }} id="vector-chart-box">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              id="cu-burn-svg"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1e293b" />

              {/* Gradient Area Fill */}
              {areaD && (
                <path d={areaD} fill="url(#chartGradient)" />
              )}

              {/* Main Line Stroke */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Dots & Touch zones */}
              {points.map((p, index) => (
                <g key={index}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="fill-[#121824] stroke-blue-400 stroke-2 hover:r-6 cursor-pointer transition-all duration-150"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPoint({
                        index,
                        x: p.x,
                        y: p.y,
                        val: p.data
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Invisible larger hover zone */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="15"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredPoint({
                        index,
                        x: p.x,
                        y: p.y,
                        val: p.data
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Float Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-10 bg-slate-900 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs font-mono select-none"
                style={{
                  left: `${(hoveredPoint.x / width) * 100}%`,
                  top: `${(hoveredPoint.y / height) * 100 - 35}%`,
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                  minWidth: '90px'
                }}
              >
                <div className="text-slate-400 text-[10px]">{hoveredPoint.val.time}</div>
                <div className="text-white font-bold">{hoveredPoint.val.spent.toLocaleString()} CU</div>
              </div>
            )}
          </div>

          {/* Time axis label - scrollable on mobile */}
          <div className="flex justify-between items-center px-2 sm:px-8 border-t border-[#1e2638] pt-3 text-[10px] sm:text-[11px] text-slate-500 font-mono overflow-x-auto gap-2" id="time-axis-labels">
            {dailyBurn.map((d, index) => (
              <span key={index} className="shrink-0">{d.time}</span>
            ))}
          </div>
        </div>

        {/* Spend by Event Breakdown */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 flex flex-col" id="spend-by-event-card">
          <h3 className="text-sm font-semibold text-slate-300 mb-5">SPEND BY EVENT</h3>
          <div className="space-y-4.5 flex-1 overflow-y-auto pr-1" id="spend-events-list">
            {spendEvents.map((evt) => {
              const widthPct = maxEventSpent > 0 ? (evt.spent / maxEventSpent) * 100 : 0;
              return (
                <div key={evt.eventName} className="space-y-1.5" id={`spend-event-${evt.eventName}`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-semibold">{evt.eventName}</span>
                    <span className="text-white">{evt.spent.toLocaleString()} CU</span>
                  </div>
                  {/* Progress bar */}
                  <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-blue-500 border-r border-blue-400 transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strategy Activities */}
      <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5" id="strategy-activities-card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Strategy Activities</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{strategyActivities.length} strategies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1e2638]">
                <th className="text-left text-slate-500 font-semibold pb-3 pr-4">Strategy</th>
                <th className="text-left text-slate-500 font-semibold pb-3 pr-4">Pair</th>
                <th className="text-right text-slate-500 font-semibold pb-3 pr-4">CU Spent</th>
                <th className="text-right text-slate-500 font-semibold pb-3 pr-4">Cycles</th>
                <th className="text-right text-slate-500 font-semibold pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {strategyActivities.map((item, i) => {
                const statusConfig = {
                  ACTIVE: { label: 'ACTIVE', icon: <Activity className="w-3 h-3" />, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  PAUSED: { label: 'PAUSED', icon: <Pause className="w-3 h-3" />, cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  STOPPED: { label: 'STOPPED', icon: <Square className="w-3 h-3" />, cls: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                }[item.status];
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4 text-slate-200 font-semibold">{item.strategyName}</td>
                    <td className="py-3 pr-4 text-slate-400">{item.pair}</td>
                    <td className="py-3 pr-4 text-right text-white">{item.cuSpent.toLocaleString()} <span className="text-slate-500">CU</span></td>
                    <td className="py-3 pr-4 text-right text-slate-300">{item.cycles}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusConfig.cls}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
