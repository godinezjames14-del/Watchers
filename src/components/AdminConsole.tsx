import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Layers, 
  Github, 
  GitBranch, 
  CalendarRange, 
  FileCheck2, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Settings,
  Database
} from 'lucide-react';
import { UserAccount } from '../types';
import { defaultUsers } from '../data/studyData';

interface AdminConsoleProps {
  onNavigateTab: (tab: any) => void;
  onSwitchUser: (user: UserAccount) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  onNavigateTab,
  onSwitchUser,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Admin Security Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/50 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              RESTRICTED ACCESS: ADMIN PORTAL ONLY
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">Role-Based Access Control (RBAC) Active</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Watchers Administrative & Project Governance Console
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Students and Professors have restricted access limited to their academic coursework and study hubs. As <strong>Admin</strong>, you have exclusive authorization to manage the Software Project Development Laboratory Workspace, GitHub traceability, and agile boards.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs shrink-0 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Admin Session Authenticated</span>
        </div>
      </div>

      {/* Access Permission Summary Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          Role Permission & Visibility Policy (Enforced)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Student */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 uppercase text-[11px]">Student Role</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Restricted</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Allowed:</strong> Dashboard, Study Area (Concept cards, Mock defense), Course AI Policies, Assignment submissions & personal integrity reports.
            </p>
            <div className="text-[10px] text-red-400 font-medium">
              ⛔ Blocked: Kanban, Git Repo, Traceability, Sprint Plan, Submission Dossier.
            </div>
          </div>

          {/* Professor */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 uppercase text-[11px]">Professor Role</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Restricted</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Allowed:</strong> Teacher Dashboard, Class cohorts, AI policy rules builder, reviewing student follow-up verification gap reports.
            </p>
            <div className="text-[10px] text-red-400 font-medium">
              ⛔ Blocked: Kanban, Git Repo, Traceability, Sprint Plan, Submission Dossier.
            </div>
          </div>

          {/* Admin */}
          <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 uppercase text-[11px]">Admin Role (Current)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">Full Access</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Allowed:</strong> Exclusive access to the Software Project Development Lab Workspace, Kanban agile board, virtual GitHub repo, traceability matrix, and submission dossier.
            </p>
            <div className="text-[10px] text-emerald-400 font-medium">
              ✓ Full permission over all 6 laboratory development modules.
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modules Navigation Shortcuts (The 6 Workspace Items from Screenshot!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-white">
            Admin Exclusive Development Workspace Modules
          </span>
          <span>Click any module to open</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'kanban',
              title: 'Kanban Board',
              badge: '2/14 Cards',
              desc: '6 Status agile workflow (Backlog to Done) with strict rule enforcement.',
              icon: Layers,
              color: 'text-indigo-400',
            },
            {
              id: 'backlog',
              title: 'Backlog & Epics',
              badge: '5 Epics • 16 Features',
              desc: 'MoSCoW prioritization, user stories, and acceptance criteria specifications.',
              icon: Award,
              color: 'text-purple-400',
            },
            {
              id: 'github',
              title: 'GitHub Repository',
              badge: 'watchers-web (Private)',
              desc: 'Virtual repo tree (README, docs, src, tests) with PR reviews and conventional commits.',
              icon: Github,
              color: 'text-blue-400',
            },
            {
              id: 'traceability',
              title: 'Traceability Matrix',
              badge: 'End-to-End Pipeline',
              desc: 'Trace work: Card ↔ GitHub Issue ↔ Branch ↔ Commit ↔ PR ↔ Review ↔ Done.',
              icon: GitBranch,
              color: 'text-emerald-400',
            },
            {
              id: 'sprint',
              title: 'Sprint Planning',
              badge: '1-Week Sprint',
              desc: 'Balanced estimated hours capacity (35h student max) & individual accountability.',
              icon: CalendarRange,
              color: 'text-amber-400',
            },
            {
              id: 'submission',
              title: 'Submission Dossier',
              badge: 'Lab Demo Package',
              desc: 'Official laboratory submission document, contribution matrix, and markdown export.',
              icon: FileCheck2,
              color: 'text-cyan-400',
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateTab(mod.id)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer shadow-lg transition-all duration-200 space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${mod.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition flex items-center justify-between">
                    <span>{mod.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Impersonation / Test View Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Admin Role Preview & Impersonation (Test What Students and Professors See)
          </span>
          <span className="text-slate-400">Click to switch views instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onSwitchUser(defaultUsers[0])}
            className="p-3 bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-800 rounded-xl text-left transition flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white">Preview Student Experience (James Godinez)</div>
              <div className="text-[11px] text-slate-400">Notice that all lab workspace tabs disappear from their view.</div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
          </button>

          <button
            onClick={() => onSwitchUser(defaultUsers[1])}
            className="p-3 bg-slate-950 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-800 rounded-xl text-left transition flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white">Preview Professor Experience (Prof. Ramirez)</div>
              <div className="text-[11px] text-slate-400">Notice that professors only see their course cohorts & gap reports.</div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
