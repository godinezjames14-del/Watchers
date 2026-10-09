import React, { useState } from 'react';
import { 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  FileCode, 
  ShieldCheck, 
  Terminal, 
  UserCheck, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { TaskCard } from '../types';
import { initialTasks } from '../data/mockData';

interface TraceabilityMatrixProps {
  tasks: TaskCard[];
  onOpenCard?: (card: TaskCard) => void;
}

export const TraceabilityMatrix: React.FC<TraceabilityMatrixProps> = ({ tasks, onOpenCard }) => {
  const [selectedFeatureCode, setSelectedFeatureCode] = useState<'AUTH-01' | 'EVAL-01'>('AUTH-01');

  const authTask = tasks.find((t) => t.id === 'AUTH-01') || initialTasks[0];
  const evalTask = tasks.find((t) => t.id === 'EVAL-01') || initialTasks[2];

  const currentTask = selectedFeatureCode === 'AUTH-01' ? authTask : evalTask;

  const traceSteps = selectedFeatureCode === 'AUTH-01'
    ? [
        {
          stage: '1. Board Card',
          title: 'AUTH-01: Implement user login',
          desc: 'Kanban Card in ClickUp/Trello workspace with MoSCoW Must Have priority and acceptance criteria.',
          icon: Layers,
          badge: 'Board ID: AUTH-01',
          color: 'text-indigo-400 bg-indigo-950/60 border-indigo-900',
        },
        {
          stage: '2. GitHub Issue',
          title: 'Issue #12: Implement login interface',
          desc: 'Repository issue created from card scope with acceptance test checklist.',
          icon: AlertCircle,
          badge: 'Issue #12 (Closed)',
          color: 'text-blue-400 bg-blue-950/60 border-blue-900',
        },
        {
          stage: '3. Git Branch',
          title: 'feature/12-user-login',
          desc: 'Branched from protected main using feature/<issue>-<short-name> naming standard.',
          icon: GitBranch,
          badge: 'feature/12-user-login',
          color: 'text-purple-400 bg-purple-950/60 border-purple-900',
        },
        {
          stage: '4. Git Commit',
          title: 'feat(auth): implement login form (a7b89f2)',
          desc: 'Conventional commit format referencing issue #12 without hardcoded secrets.',
          icon: GitCommit,
          badge: 'Hash: a7b89f2',
          color: 'text-amber-400 bg-amber-950/60 border-amber-900',
        },
        {
          stage: '5. Pull Request',
          title: 'PR #14: Add user login interface',
          desc: 'Pull request targeting main with automated CI validation checks passing.',
          icon: GitPullRequest,
          badge: 'PR #14 (Merged)',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-900',
        },
        {
          stage: '6. Peer Review',
          title: 'Reviewer: Carlos Reyes (APPROVED)',
          desc: 'Verified role distinction, JWT expiry handling, and test coverage before merge approval.',
          icon: UserCheck,
          badge: 'Status: APPROVED',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-900',
        },
        {
          stage: '7. Verification Evidence',
          title: '14 Passing Unit Tests',
          desc: 'npm test -- --grep "auth" -> 14 passed. Logged in card audit trail.',
          icon: ShieldCheck,
          badge: 'Tests: 100% Pass',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-900',
        },
        {
          stage: '8. Status Transition',
          title: 'Card Moved to Done',
          desc: 'Complied with Rule 2: Cannot enter Done without review & verification evidence.',
          icon: CheckCircle2,
          badge: 'Status: Done',
          color: 'text-emerald-300 bg-emerald-950 border-emerald-700',
        },
      ]
    : [
        {
          stage: '1. Board Card',
          title: 'EVAL-01: Follow-up assessment quiz engine',
          desc: 'Kanban Card for Watchers core differentiator: independent verification of submitted work.',
          icon: Layers,
          badge: 'Board ID: EVAL-01',
          color: 'text-indigo-400 bg-indigo-950/60 border-indigo-900',
        },
        {
          stage: '2. GitHub Issue',
          title: 'Issue #18: Implement follow-up assessment quiz',
          desc: 'Detailed specification of 3-question adaptive prompt generator and 5-min timer.',
          icon: AlertCircle,
          badge: 'Issue #18 (Open)',
          color: 'text-blue-400 bg-blue-950/60 border-blue-900',
        },
        {
          stage: '3. Git Branch',
          title: 'feature/18-followup-quiz-engine',
          desc: 'Feature branch created by Althea Cruz (QA & Assessment Lead).',
          icon: GitBranch,
          badge: 'feature/18-followup-quiz-engine',
          color: 'text-purple-400 bg-purple-950/60 border-purple-900',
        },
        {
          stage: '4. Git Commit',
          title: 'feat(eval): add concept verification generator (8e4f102)',
          desc: 'Implementation of prompt selector and localStorage buffer for offline resilience.',
          icon: GitCommit,
          badge: 'Hash: 8e4f102',
          color: 'text-amber-400 bg-amber-950/60 border-amber-900',
        },
        {
          stage: '5. Pull Request',
          title: 'PR #21: Add follow-up quiz engine & browser telemetry',
          desc: 'Pull request currently under review with diff stats +420 / -12.',
          icon: GitPullRequest,
          badge: 'PR #21 (In Review)',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-900',
        },
        {
          stage: '6. Peer Review',
          title: 'Reviewers: James Godinez & David Tan',
          desc: 'Reviewed focus loss telemetry ethics and auto-save mechanisms.',
          icon: UserCheck,
          badge: 'Status: In Review',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-900',
        },
        {
          stage: '7. Verification Evidence',
          title: '11 Passing Tests in Staging',
          desc: 'Assessment timer auto-submits upon expiry; copy/paste restriction validated.',
          icon: ShieldCheck,
          badge: 'QA Verified',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-900',
        },
        {
          stage: '8. Status Transition',
          title: 'Card in Testing',
          desc: 'Active testing pipeline prior to final PR merge into main.',
          icon: CheckCircle2,
          badge: 'Status: Testing',
          color: 'text-cyan-300 bg-cyan-950 border-cyan-700',
        },
      ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-800/40 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-xs">
            Lab Manual Deliverable: Traceability Exercise
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-slate-300 text-xs">End-to-End Activity Verification</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Feature Traceability Matrix & Audit Pipeline
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Demonstrates complete traceability from project board task card to GitHub issue, branch, commit, pull request, peer review findings, and verification evidence as required by Laboratory Manual Page 2.
        </p>

        {/* Feature Selector Buttons */}
        <div className="flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setSelectedFeatureCode('AUTH-01')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedFeatureCode === 'AUTH-01'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Trace 1: AUTH-01 (User Login & Role Guard) [Status: Done]</span>
          </button>

          <button
            onClick={() => setSelectedFeatureCode('EVAL-01')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedFeatureCode === 'EVAL-01'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Trace 2: EVAL-01 (Follow-Up Assessment Engine) [Status: Testing]</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Sequential Trace Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            End-to-End Traceability Chain: {selectedFeatureCode}
          </span>
          <span>Click any card to inspect artifact</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {traceSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {step.stage}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${step.color}`}>
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {idx < traceSteps.length - 1 && (
                  <div className="pt-2 flex justify-end">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden lg:block" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Trace Inspection Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Traceability Audit Evidence & Verification Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Card: <strong className="text-indigo-400">{currentTask.id}</strong> — {currentTask.title}
            </p>
          </div>

          <button
            onClick={() => onOpenCard && onOpenCard(currentTask)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-start"
          >
            <span>Open Board Card</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Git & PR Verification */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Git Repository Artifacts
            </span>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Issue:</span>
                <span className="font-mono text-white">#{currentTask.githubIssueNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Branch:</span>
                <span className="font-mono text-purple-300">{currentTask.githubBranch}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Commit:</span>
                <span className="font-mono text-amber-300">{currentTask.commitHash}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Pull Request:</span>
                <span className="font-mono text-cyan-300">PR #{currentTask.githubPrNumber}</span>
              </div>
            </div>
          </div>

          {/* Test & QA Evidence */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Verification & Sign-off Evidence
            </span>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Verified By:</span>
                <span className="font-semibold text-emerald-400">{currentTask.verificationEvidence?.verifiedBy || 'Carlos Reyes'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{currentTask.verificationEvidence?.verifiedAt || '2026-10-10 16:45 PST'}</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 text-[11px]">Test Suite Run Command & Output:</span>
                <div className="bg-slate-900 p-2.5 rounded font-mono text-[11px] text-emerald-300 border border-slate-800">
                  {currentTask.verificationEvidence?.testSuiteRun || 'npm test -> 14 passed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
