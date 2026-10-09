import React, { useState } from 'react';
import { 
  Github, 
  Folder, 
  FileCode, 
  FileText, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Lock, 
  Star, 
  Eye, 
  Search,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { virtualRepoFiles, gitHubIssues, gitHubCommits, gitHubPullRequests, teamMembers } from '../data/mockData';
import { GitHubIssue, GitHubPullRequest, GitHubCommit } from '../types';

export const GithubExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'issues' | 'prs' | 'commits'>('code');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [selectedFilePath, setSelectedFilePath] = useState<string>('README.md');
  const [copied, setCopied] = useState(false);
  const [searchIssueQuery, setSearchIssueQuery] = useState('');
  const [selectedPrNumber, setSelectedPrNumber] = useState<number>(14);

  const selectedFile = virtualRepoFiles.find((f) => f.path === selectedFilePath) || virtualRepoFiles[0];

  const handleCopyCode = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (!selectedFile?.content) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.split('/').pop() || 'file';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* GitHub Repository Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Github className="w-4 h-4 text-white" />
              <span className="hover:underline cursor-pointer">watchers-project</span>
              <span>/</span>
              <span className="font-bold text-white text-sm">watchers-web</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] border border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Private
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Official repository for Watchers - Web-based Learning Integrity Platform (Philippine Startup Challenge XI).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Branch Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none"
              >
                <option value="main">main (protected)</option>
                <option value="feature/12-user-login">feature/12-user-login</option>
                <option value="feature/18-followup-quiz-engine">feature/18-followup-quiz-engine</option>
                <option value="feature/19-ai-policy-engine">feature/19-ai-policy-engine</option>
                <option value="feature/20-telemetry-focus-logger">feature/20-telemetry-focus-logger</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>main: Protected</span>
            </div>
          </div>
        </div>

        {/* GitHub Subtabs: Code, Issues, PRs, Commits */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/60 flex gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('code')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              activeSubTab === 'code'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Code ({virtualRepoFiles.length} files)
          </button>

          <button
            onClick={() => setActiveSubTab('issues')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              activeSubTab === 'issues'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Issues ({gitHubIssues.length})
          </button>

          <button
            onClick={() => setActiveSubTab('prs')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              activeSubTab === 'prs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            Pull Requests ({gitHubPullRequests.length})
          </button>

          <button
            onClick={() => setActiveSubTab('commits')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              activeSubTab === 'commits'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            Commits ({gitHubCommits.length})
          </button>
        </div>

        {/* Subtab Contents */}
        <div className="p-4 sm:p-6">
          {/* CODE TAB */}
          {activeSubTab === 'code' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* File Tree Sidebar */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Repository File Tree
                </span>

                <div className="space-y-1 text-xs">
                  {virtualRepoFiles.map((file) => {
                    const isSelected = selectedFilePath === file.path;
                    const isMarkdown = file.name.endsWith('.md');

                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFilePath(file.path)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        {isMarkdown ? (
                          <FileText className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                        ) : (
                          <FileCode className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                        )}
                        <span className="truncate">{file.path}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Viewer */}
              <div className="lg:col-span-3 bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                {/* File Header */}
                <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">
                      {selectedFile.path}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono">
                      {selectedFile.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Content'}</span>
                    </button>
                    <button
                      onClick={handleDownloadFile}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* File Content Display */}
                <div className="p-5 font-mono text-xs overflow-x-auto max-h-[620px] overflow-y-auto leading-relaxed text-slate-300">
                  <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ISSUES TAB */}
          {activeSubTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchIssueQuery}
                    onChange={(e) => setSearchIssueQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {gitHubIssues
                  .filter((issue) =>
                    issue.title.toLowerCase().includes(searchIssueQuery.toLowerCase()) ||
                    issue.body.toLowerCase().includes(searchIssueQuery.toLowerCase())
                  )
                  .map((issue) => (
                    <div
                      key={issue.number}
                      className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-full ${issue.state === 'closed' ? 'bg-purple-950/60 text-purple-400' : 'bg-emerald-950/60 text-emerald-400'}`}>
                            {issue.state === 'closed' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            #{issue.number} {issue.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] rounded">
                            Linked: {issue.cardId}
                          </span>
                          <span className="text-slate-400 text-xs">
                            Created {issue.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {issue.body}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          {issue.labels.map((lbl) => (
                            <span key={lbl} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">
                              {lbl}
                            </span>
                          ))}
                        </div>
                        <div>Author: @{issue.author}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* PULL REQUESTS TAB */}
          {activeSubTab === 'prs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gitHubPullRequests.map((pr) => {
                  const isSelected = selectedPrNumber === pr.number;
                  return (
                    <div
                      key={pr.number}
                      onClick={() => setSelectedPrNumber(pr.number)}
                      className={`p-5 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-slate-900 border-indigo-500 shadow-xl ring-1 ring-indigo-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <GitPullRequest className={`w-4 h-4 ${pr.status === 'merged' ? 'text-purple-400' : 'text-emerald-400'}`} />
                          <span className="text-xs font-bold text-white">
                            PR #{pr.number}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            pr.status === 'merged'
                              ? 'bg-purple-950/60 text-purple-300 border border-purple-800'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          }`}>
                            {pr.status}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-indigo-400">
                          {pr.cardId}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white mt-2 leading-snug">
                        {pr.title}
                      </h4>

                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                        <span>Branch: <code className="text-indigo-300">{pr.branch}</code></span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">+{pr.diffStats.additions}</span>
                        <span className="text-red-400 font-mono">-{pr.diffStats.deletions}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active PR Detail View */}
              {(() => {
                const activePr = gitHubPullRequests.find((p) => p.number === selectedPrNumber) || gitHubPullRequests[0];
                return (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">
                            PR #{activePr.number}: {activePr.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Author: @{activePr.author} • Base: <code>{activePr.base}</code> ← Compare: <code>{activePr.branch}</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
                          1 Peer Reviewer Required (Passed)
                        </span>
                      </div>
                    </div>

                    {/* PR Body */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono text-xs whitespace-pre-line leading-relaxed text-slate-300">
                      {activePr.description}
                    </div>

                    {/* Peer Review Findings */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Peer Review Findings & Signoff (Lab Manual Exercise Requirement)
                      </span>

                      {activePr.reviewFindings.map((finding, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-xs">
                              {finding.reviewer}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {finding.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            "{finding.comment}"
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {finding.reviewedAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* COMMITS TAB */}
          {activeSubTab === 'commits' && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Conventional Commit History with Issue References
              </span>

              {gitHubCommits.map((c) => (
                <div
                  key={c.hash}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-indigo-400" />
                      <span className="font-mono text-white font-medium">
                        {c.message}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      {c.author} • Branch: <code className="text-slate-300">{c.branch}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-indigo-400 bg-indigo-950/60 px-2 py-1 rounded border border-indigo-900">
                      {c.hash}
                    </span>
                    <span className="text-slate-500 text-[11px] whitespace-nowrap">
                      {c.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
