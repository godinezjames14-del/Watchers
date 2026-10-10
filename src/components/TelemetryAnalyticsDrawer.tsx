import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StudentExamTelemetry } from '../types';

interface TelemetryAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: StudentExamTelemetry | null;
}

export const TelemetryAnalyticsDrawer: React.FC<TelemetryAnalyticsDrawerProps> = ({
  isOpen,
  onClose,
  telemetry,
}) => {
  if (!isOpen || !telemetry) return null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'timing_chart' | 'defense'>('timing_chart');

  // Max time for scaling the chart visually
  const maxTime = Math.max(90, ...(telemetry.questionTiming?.map((q) => q.timeSpentSeconds) || [60]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={telemetry.studentAvatar}
              alt={telemetry.studentName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  {telemetry.studentName}
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  telemetry.riskTier === 'Needs Watching'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                }`}>
                  {telemetry.riskTier}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] font-mono mt-0.5">
                ID {telemetry.studentId} · Risk Score: <strong className={telemetry.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'}>{telemetry.riskScore}/100</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs */}
        <div className="px-6 pt-3 flex items-center gap-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('timing_chart')}
            className={`pb-2.5 font-medium transition-colors ${
              activeTab === 'timing_chart'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Time vs. Difficulty Analytics
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activity Timeline ({telemetry.eventsLog?.length || 0})
          </button>
          {telemetry.microDefenseTriggered && (
            <button
              onClick={() => setActiveTab('defense')}
              className={`pb-2.5 font-medium transition-colors ${
                activeTab === 'defense'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Micro-Defense Log
            </button>
          )}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Quick Telemetry Metric Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Total Away</span>
              <span className="text-base font-semibold text-slate-200 tabular-nums font-mono">
                {telemetry.totalAwaySeconds}s
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Tab Switches</span>
              <span className={`text-base font-semibold tabular-nums font-mono ${
                telemetry.tabSwitchCount > 0 ? 'text-amber-400' : 'text-slate-200'
              }`}>
                {telemetry.tabSwitchCount} times
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Grace Misclicks</span>
              <span className="text-base font-semibold text-slate-400 tabular-nums font-mono">
                {telemetry.fleetingAbsencesCount} ignored
              </span>
            </div>
          </div>

          {/* TAB 1: Time vs. Difficulty Visual Chart */}
          {activeTab === 'timing_chart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Question Answering Velocity Analysis
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Plots time spent per question against question difficulty tier.
                  </p>
                </div>
              </div>

              {/* Visual Bars / Chart */}
              <div className="space-y-3.5 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                {(telemetry.questionTiming || []).map((q, idx) => {
                  const widthPct = Math.min(100, Math.max(8, (q.timeSpentSeconds / maxTime) * 100));
                  return (
                    <div key={q.questionId || idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-slate-300 font-medium truncate max-w-[240px]">
                            {q.questionPrompt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono tabular-nums">
                          <span className={q.anomalousSpeed ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                            {q.timeSpentSeconds}s
                          </span>
                          {q.anomalousSpeed && (
                            <span className="text-[10px] text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/60 font-sans">
                              ⚠ Anomalous Speed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bar Visualizer */}
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800/60">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            q.anomalousSpeed
                              ? 'bg-rose-500'
                              : q.difficulty === 'Easy'
                              ? 'bg-emerald-500'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanatory note */}
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-slate-300">Pedagogical Speed Heuristic:</strong> Answering a &ldquo;Hard&rdquo; algorithmic question in under 5 seconds indicates probable external clipboard copying or unauthorized assistance, which triggers the Micro-Defense protocol.
              </div>
            </div>
          )}

          {/* TAB 2: Activity Timeline Log */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-400">
                Chronological Exam Window Audit Trail
              </div>

              <div className="relative pl-6 border-l border-slate-800 space-y-4">
                {(telemetry.eventsLog || []).map((ev) => (
                  <div key={ev.id} className="relative group">
                    {/* Event marker dot */}
                    <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border ${
                      ev.type === 'tab_switch'
                        ? 'bg-rose-500 border-rose-400'
                        : ev.type === 'paste_flood'
                        ? 'bg-amber-500 border-amber-400'
                        : ev.type === 'fleeting_absence'
                        ? 'bg-slate-600 border-slate-500'
                        : 'bg-emerald-500 border-emerald-400'
                    }`} />

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-500">{ev.timestamp}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          ev.type === 'tab_switch'
                            ? 'text-rose-400 bg-rose-950/60'
                            : ev.type === 'paste_flood'
                            ? 'text-amber-400 bg-amber-950/60'
                            : 'text-slate-400'
                        }`}>
                          {ev.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs">
                        {ev.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Micro-Defense Record */}
          {activeTab === 'defense' && telemetry.microDefenseTriggered && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Escalated AI Follow-Up Inquiry</span>
                </div>
                <p className="text-slate-100 text-sm font-medium">
                  &ldquo;{telemetry.microDefenseQuestion}&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider block">
                  Student Verbal / Written Defense Answer
                </span>
                <p className="text-slate-200 leading-relaxed font-serif italic text-xs">
                  &ldquo;{telemetry.microDefenseAnswer || 'No response recorded'}&rdquo;
                </p>
                <div className="pt-2 flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium text-xs">Independently Verified by Faculty Protocol</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
