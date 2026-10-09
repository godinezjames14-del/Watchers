import React, { useState } from 'react';
import { 
  CalendarRange, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight,
  Plus,
  Check
} from 'lucide-react';
import { currentSprint, teamMembers } from '../data/mockData';
import { TaskCard } from '../types';

interface SprintPlanningViewProps {
  tasks: TaskCard[];
  onOpenCard?: (task: TaskCard) => void;
}

export const SprintPlanningView: React.FC<SprintPlanningViewProps> = ({ tasks, onOpenCard }) => {
  const sprintTasks = tasks.filter((t) => t.inSprint);
  const [blockers, setBlockers] = useState(currentSprint.blockers);
  const [newBlockerText, setNewBlockerText] = useState('');
  const [newBlockerOwner, setNewBlockerOwner] = useState(teamMembers[0].name);

  const totalSprintEstimate = sprintTasks.reduce((acc, t) => acc + t.estimateHours, 0);
  const totalCompletedHours = sprintTasks
    .filter((t) => t.status === 'Done')
    .reduce((acc, t) => acc + t.estimateHours, 0);

  const sprintProgress = Math.round((totalCompletedHours / (totalSprintEstimate || 1)) * 100);

  const handleAddBlocker = () => {
    if (!newBlockerText.trim()) return;
    setBlockers([
      ...blockers,
      {
        id: `blk-${Date.now()}`,
        description: newBlockerText.trim(),
        owner: newBlockerOwner,
        status: 'active',
      },
    ]);
    setNewBlockerText('');
  };

  const toggleBlockerStatus = (id: string) => {
    setBlockers(
      blockers.map((b) =>
        b.id === id ? { ...b, status: b.status === 'active' ? 'resolved' : 'active' } : b
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Sprint Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 p-6 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              Lab Manual Section 4
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">One-Week Sprint (7-Day Duration)</span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {currentSprint.startDate} → {currentSprint.endDate}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {currentSprint.name}
          </h2>
          <div className="mt-2 p-3 bg-indigo-900/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 leading-relaxed">
            <strong>Sprint Goal:</strong> "{currentSprint.goal}"
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sprint Burndown / Progress</span>
            <span className="font-mono text-emerald-400 font-bold">
              {totalCompletedHours}h / {totalSprintEstimate}h completed ({sprintProgress}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${sprintProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Member Workload Balancing Grid (Requirement: balance hours, not just card count) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Member Workload Balancing & Capacity Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lab rule: Balance estimated hours rather than number of cards to guarantee equitable workload and avoid burnout.
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
            Standard Student Lab Capacity: 35h / week
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {teamMembers.map((member) => {
            const memberTasks = sprintTasks.filter((t) => t.assigneeId === member.id);
            const totalHours = memberTasks.reduce((acc, t) => acc + t.estimateHours, 0);
            const loadPercent = Math.round((totalHours / member.capacityHours) * 100);

            const statusColor =
              loadPercent > 100
                ? 'text-red-400 bg-red-950/60 border-red-800'
                : loadPercent >= 80
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                : 'text-blue-400 bg-blue-950/60 border-blue-800';

            return (
              <div
                key={member.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/40"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">
                        {member.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {member.role.split('&')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Assigned Load</span>
                      <span className="font-mono font-bold text-white">
                        {totalHours}h / {member.capacityHours}h
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          loadPercent > 100 ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, loadPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{memberTasks.length} Cards Owned</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${statusColor}`}>
                    {loadPercent}% Capacity
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Accountability Verification Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Individual Accountability Check (Lab Manual Requirement 4)
          </h3>
          <p className="text-xs text-slate-400">
            Mandate: Ensure each team member owns at least one substantive implementation or verification task.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {teamMembers.map((m) => {
            const owned = sprintTasks.filter((t) => t.assigneeId === m.id);
            const verified = sprintTasks.filter((t) => t.reviewerId === m.id);
            const compliant = owned.length > 0;

            return (
              <div
                key={m.id}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{m.name.split(' ')[0]}</span>
                  {compliant ? (
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Accountable
                    </span>
                  ) : (
                    <span className="text-red-400 text-[10px] font-bold">Needs Task</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Implementation: {owned.map((t) => t.id).join(', ') || 'None'}</div>
                  <div>Peer Reviewer on: {verified.map((t) => t.id).join(', ') || 'None'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sprint Backlog Table & Blockers Register */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Backlog Tasks */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Sprint 1 Committed Tasks ({sprintTasks.length})
            </h3>
            <span className="text-xs text-slate-400">Click card to view details</span>
          </div>

          <div className="space-y-2 text-xs">
            {sprintTasks.map((t) => {
              const assignee = teamMembers.find((m) => m.id === t.assigneeId);
              const reviewer = teamMembers.find((m) => m.id === t.reviewerId);

              return (
                <div
                  key={t.id}
                  onClick={() => onOpenCard && onOpenCard(t)}
                  className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group transition"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 font-bold text-xs">
                        {t.id}
                      </span>
                      <h4 className="font-semibold text-white group-hover:text-indigo-300 transition">
                        {t.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Owner: <strong className="text-slate-300">{assignee?.name || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>Reviewer: <strong className="text-slate-300">{reviewer?.name || 'Unassigned'}</strong></span>
                      <span>•</span>
                      <span>Due: {t.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {t.estimateHours}h
                    </span>
                    <span className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blockers & Risk Registry */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Blocker & Risk Registry
            </h3>
            <span className="text-xs text-amber-300 font-mono">
              {blockers.filter((b) => b.status === 'active').length} Active
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {blockers.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border space-y-2 transition ${
                  b.status === 'active'
                    ? 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`leading-relaxed text-xs ${b.status === 'resolved' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {b.description}
                  </p>
                  <button
                    onClick={() => toggleBlockerStatus(b.id)}
                    className="p-1 text-slate-400 hover:text-white shrink-0"
                    title={b.status === 'active' ? 'Mark as Resolved' : 'Reopen Blocker'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${b.status === 'resolved' ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Owner: {b.owner}</span>
                  <span className="uppercase font-mono text-[10px]">[{b.status}]</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Blocker Form */}
          <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
            <input
              type="text"
              placeholder="Record new impediment or risk..."
              value={newBlockerText}
              onChange={(e) => setNewBlockerText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <div className="flex gap-2">
              <select
                value={newBlockerOwner}
                onChange={(e) => setNewBlockerOwner(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs flex-1"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddBlocker}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
