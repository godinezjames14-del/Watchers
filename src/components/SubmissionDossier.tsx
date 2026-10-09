import React, { useState } from 'react';
import { 
  FileCheck2, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Award, 
  Users, 
  GitBranch, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { contributionMatrix, teamMembers, epics, currentSprint } from '../data/mockData';
import { TaskCard } from '../types';

interface SubmissionDossierProps {
  tasks: TaskCard[];
}

export const SubmissionDossier: React.FC<SubmissionDossierProps> = ({ tasks }) => {
  const [copied, setCopied] = useState(false);

  const doneTasks = tasks.filter((t) => t.status === 'Done');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');

  const workspaceUrl = 'https://watchers-workspace.internal/board';
  const githubRepoUrl = 'https://github.com/watchers-project/watchers-web';
  const issue1Url = 'https://github.com/watchers-project/watchers-web/issues/12';
  const issue2Url = 'https://github.com/watchers-project/watchers-web/issues/18';
  const pr1Url = 'https://github.com/watchers-project/watchers-web/pull/14';

  const generateFullMarkdownReport = () => {
    let doc = `# LABORATORY SUBMISSION & PROJECT DOSSIER\n`;
    doc += `**Course:** Software Project Development | Laboratory Manual Exercise 1\n`;
    doc += `**Project:** WATCHERS (Philippine Startup Challenge XI Entry)\n`;
    doc += `**Submission Date:** October 2026\n\n`;

    doc += `## 1. Submission URLs & Repository Links\n`;
    doc += `- **Team Workspace URL:** ${workspaceUrl}\n`;
    doc += `- **GitHub Repository:** ${githubRepoUrl} (Private)\n`;
    doc += `- **Issue Link 1 (AUTH-01):** ${issue1Url}\n`;
    doc += `- **Issue Link 2 (EVAL-01):** ${issue2Url}\n`;
    doc += `- **Reviewed Pull Request (PR #14):** ${pr1Url}\n\n`;

    doc += `## 2. Project Proposal Summary (Watchers Concept Note)\n`;
    doc += `Watchers is a web-based learning integrity platform designed to help schools understand whether students can independently demonstrate the knowledge behind their submitted work in an environment where AI and other digital tools are widely available. Rather than relying on unreliable AI detectors or treating tool use as automatic misconduct, Watchers combines teacher-defined assessment rules, short independent follow-up tasks, and learning analytics. It aligns with SDG 4 (Quality Education) and Philippine Data Privacy Act RA 10173.\n\n`;

    doc += `## 3. Epics & Backlog Scope\n`;
    epics.forEach((ep) => {
      doc += `- **${ep.code}:** ${ep.title} (${ep.description})\n`;
    });
    doc += `\n`;

    doc += `## 4. One-Week Sprint Plan Summary\n`;
    doc += `- **Sprint Goal:** ${currentSprint.goal}\n`;
    doc += `- **Total Committed Hours:** ${currentSprint.totalEstimatedHours}h\n`;
    doc += `- **Dates:** ${currentSprint.startDate} to ${currentSprint.endDate}\n\n`;

    doc += `## 5. Member Contribution Matrix\n`;
    doc += `| Member | Role | Tasks Owned | PRs | Reviews | Est Hours | Actual Hours | Score |\n`;
    doc += `|---|---|:---:|:---:|:---:|:---:|:---:|:---:|\n`;
    contributionMatrix.forEach((m) => {
      doc += `| ${m.name} | ${m.role} | ${m.tasksOwnedCount} | ${m.prCount} | ${m.reviewsCount} | ${m.estimatedHours}h | ${m.actualHours}h | ${m.accountabilityScore}% |\n`;
    });

    return doc;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateFullMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watchers_lab_submission_dossier.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              Lab Manual Section 5
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">Demonstration & Submission Package</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Official Laboratory Submission Dossier
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Complete project setup, team contribution matrix, traceability verification artifacts, and proposal summary ready for academic evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Dossier'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export (.md)</span>
          </button>
        </div>
      </div>

      {/* Deliverable Checklist & Demonstration Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demonstration Checklist (from Manual Page 2) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Required Demonstration Checklist
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Demonstrate the shared board (6 statuses with rule enforcement)', status: 'Verified' },
              { label: 'Clear task owners, priorities (MoSCoW), estimates, and deadlines', status: 'Verified' },
              { label: 'GitHub repository configured with standard docs & branching rules', status: 'Verified' },
              { label: 'Two issue links demonstrating bidirectional task linkage (#12 & #18)', status: 'Verified' },
              { label: 'One peer-reviewed PR with comments, approval, and test log (PR #14)', status: 'Verified' },
              { label: 'One-week sprint plan with balanced workload & accountability matrix', status: 'Verified' },
              { label: 'Proposal summary & Philippine Startup Challenge XI alignment', status: 'Verified' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{item.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Submission URLs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            Submission URLs & Artifact Pointers
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                1. Project Workspace Board URL (Trello / ClickUp)
              </span>
              <div className="flex items-center justify-between text-indigo-400 font-mono text-xs">
                <span>{workspaceUrl}</span>
                <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded text-[10px]">Active</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                2. GitHub Repository URL
              </span>
              <div className="flex items-center justify-between text-indigo-400 font-mono text-xs">
                <span>{githubRepoUrl}</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">Private (Invited)</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                3. Two Backlog GitHub Issues
              </span>
              <div className="space-y-1 font-mono text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Issue #12 (AUTH-01: Login Interface)</span>
                  <span className="text-emerald-400 font-bold">Closed (Done)</span>
                </div>
                <div className="flex justify-between">
                  <span>Issue #18 (EVAL-01: Quiz Engine)</span>
                  <span className="text-cyan-400 font-bold">Open (Testing)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                4. Peer-Reviewed Pull Request
              </span>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300">PR #14: Add user login interface</span>
                <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded text-[10px]">Approved & Merged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Contribution Matrix (Required on Manual Page 2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Member Contribution Matrix & Accountability Audit
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual tracking of tasks owned, PR authorship, peer review sign-offs, and estimated vs. actual effort.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800">
            5/5 Members Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Team Member</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Primary Deliverables</th>
                <th className="p-3.5 text-center">Cards Owned</th>
                <th className="p-3.5 text-center">PRs Authored</th>
                <th className="p-3.5 text-center">Reviews Done</th>
                <th className="p-3.5 text-center">Est. Hours</th>
                <th className="p-3.5 text-center">Actual Hours</th>
                <th className="p-3.5 text-right">Accountability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {contributionMatrix.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold text-white whitespace-nowrap">
                    {m.name}
                  </td>
                  <td className="p-3.5 text-slate-300 whitespace-nowrap">
                    {m.role}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {m.primaryTasks.join(', ')}
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-white">
                    {m.tasksOwnedCount}
                  </td>
                  <td className="p-3.5 text-center font-mono text-purple-300">
                    {m.prCount}
                  </td>
                  <td className="p-3.5 text-center font-mono text-cyan-300">
                    {m.reviewsCount}
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-300">
                    {m.estimatedHours}h
                  </td>
                  <td className="p-3.5 text-center font-mono text-emerald-400 font-bold">
                    {m.actualHours}h
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                    {m.accountabilityScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Concept Note Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Philippine Startup Challenge XI - WATCHERS Executive Concept Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">
              The Core Problem
            </span>
            <p className="text-slate-300 leading-relaxed">
              AI assistants help students produce polished work, but teachers cannot discern if it reflects genuine understanding. Flawed AI detectors trigger false accusations and harm student-teacher trust.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
              The Watchers Solution
            </span>
            <p className="text-slate-300 leading-relaxed">
              Combines clear teacher AI rules, student disclosure forms, and short independent follow-up verification quizzes covering the submitted concepts to generate fair Demonstrated Understanding Gap Reports.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-purple-400 uppercase tracking-wider text-[11px]">
              SDG 4 Alignment & Ethics
            </span>
            <p className="text-slate-300 leading-relaxed">
              Aligns with SDG 4 (Quality Education). Contextual telemetry is strictly non-punitive. Students have formal dialogue channels to explain their methodology before any academic grade is determined.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
