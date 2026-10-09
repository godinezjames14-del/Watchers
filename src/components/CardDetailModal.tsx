import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  CheckSquare, 
  Clock, 
  Calendar, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Plus, 
  Trash2,
  FileCode,
  GitPullRequest,
  CheckCircle2
} from 'lucide-react';
import { TaskCard, ColumnStatus, Priority, TeamMember, VerificationEvidence } from '../types';
import { teamMembers } from '../data/mockData';

interface CardDetailModalProps {
  card: TaskCard | null;
  onClose: () => void;
  onUpdateCard: (updated: TaskCard) => void;
  onMoveStatus: (card: TaskCard, newStatus: ColumnStatus) => void;
}

const statusOptions: ColumnStatus[] = ['Backlog', 'To Do', 'In Progress', 'For Review', 'Testing', 'Done'];
const priorityOptions: Priority[] = ['Must Have', 'Should Have', 'Could Have', "Won't Have"];

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onUpdateCard,
  onMoveStatus,
}) => {
  if (!card) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'traceability' | 'verification'>('details');
  const [editedCard, setEditedCard] = useState<TaskCard>({ ...card });
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCriteriaText, setNewCriteriaText] = useState('');

  // Handle checklist toggle
  const toggleChecklist = (id: string) => {
    const updated = editedCard.checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    const newCard = { ...editedCard, checklist: updated };
    setEditedCard(newCard);
    onUpdateCard(newCard);
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `c-${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false,
    };
    const newCard = {
      ...editedCard,
      checklist: [...editedCard.checklist, newItem],
    };
    setEditedCard(newCard);
    onUpdateCard(newCard);
    setNewChecklistText('');
  };

  const removeChecklistItem = (id: string) => {
    const newCard = {
      ...editedCard,
      checklist: editedCard.checklist.filter((i) => i.id !== id),
    };
    setEditedCard(newCard);
    onUpdateCard(newCard);
  };

  // Handle criteria toggle
  const toggleCriteria = (id: string) => {
    const updated = editedCard.acceptanceCriteria.map((crit) =>
      crit.id === id ? { ...crit, completed: !crit.completed } : crit
    );
    const newCard = { ...editedCard, acceptanceCriteria: updated };
    setEditedCard(newCard);
    onUpdateCard(newCard);
  };

  const addCriteria = () => {
    if (!newCriteriaText.trim()) return;
    const newCrit = {
      id: `ac-${Date.now()}`,
      text: newCriteriaText.trim(),
      completed: false,
    };
    const newCard = {
      ...editedCard,
      acceptanceCriteria: [...editedCard.acceptanceCriteria, newCrit],
    };
    setEditedCard(newCard);
    onUpdateCard(newCard);
    setNewCriteriaText('');
  };

  const handleStatusChange = (newStatus: ColumnStatus) => {
    onMoveStatus(editedCard, newStatus);
    setEditedCard({ ...editedCard, status: newStatus });
  };

  const handleAssigneeChange = (memberId: string) => {
    const updated = { ...editedCard, assigneeId: memberId || undefined };
    setEditedCard(updated);
    onUpdateCard(updated);
  };

  const handleReviewerChange = (memberId: string) => {
    const updated = { ...editedCard, reviewerId: memberId || undefined };
    setEditedCard(updated);
    onUpdateCard(updated);
  };

  const handlePriorityChange = (priority: Priority) => {
    const updated = { ...editedCard, priority };
    setEditedCard(updated);
    onUpdateCard(updated);
  };

  const handleVerificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCard(editedCard);
  };

  const assignee = teamMembers.find((m) => m.id === editedCard.assigneeId);
  const reviewer = teamMembers.find((m) => m.id === editedCard.reviewerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-800/80 border-b border-slate-700/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold rounded">
                {editedCard.id}
              </span>
              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-medium rounded">
                {editedCard.epicId.toUpperCase()}
              </span>
              {editedCard.isMvp && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded">
                  ★ MVP Essential
                </span>
              )}
              {editedCard.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                  #{tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight pt-1">
              {editedCard.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/50 flex gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Task Details & Criteria
          </button>
          <button
            onClick={() => setActiveTab('traceability')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'traceability'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            GitHub Traceability Link
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'verification'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Verification Evidence
            {editedCard.verificationEvidence && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-slate-300">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Story, Description, Acceptance Criteria, Checklist */}
              <div className="md:col-span-2 space-y-6">
                {/* User Story Box */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                    User Story (Agile Specification)
                  </span>
                  <p className="text-slate-200 italic leading-relaxed">
                    "{editedCard.userStory}"
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Task Scope & Description
                  </label>
                  <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                    {editedCard.description}
                  </p>
                </div>

                {/* Acceptance Criteria (Strict Lab Rule Requirement) */}
                <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Acceptance Criteria (Mandatory for In Progress)
                    </span>
                    <span className="text-xs text-slate-400">
                      {editedCard.acceptanceCriteria.filter(a => a.completed).length} of {editedCard.acceptanceCriteria.length} met
                    </span>
                  </div>

                  <div className="space-y-2">
                    {editedCard.acceptanceCriteria.map((crit) => (
                      <div
                        key={crit.id}
                        onClick={() => toggleCriteria(crit.id)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                          crit.completed
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={crit.completed}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs flex-1">{crit.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add acceptance criterion..."
                      value={newCriteriaText}
                      onChange={(e) => setNewCriteriaText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCriteria()}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={addCriteria}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Subtask Checklist */}
                <div className="space-y-3 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                      Actionable Task Checklist
                    </span>
                    <span className="text-xs text-slate-500">
                      {editedCard.checklist.filter(c => c.completed).length} / {editedCard.checklist.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {editedCard.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2 rounded hover:bg-slate-800/60 transition group"
                      >
                        <label className="flex items-center gap-2.5 cursor-pointer flex-1 text-xs">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklist(item.id)}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-300'}>
                            {item.text}
                          </span>
                        </label>
                        <button
                          onClick={() => removeChecklistItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add subtask step..."
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={addChecklistItem}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Step
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Meta fields (Status, Assignee, Reviewer, Estimate, Deadline) */}
              <div className="space-y-5 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                {/* Status Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Workflow Status
                  </label>
                  <select
                    value={editedCard.status}
                    onChange={(e) => handleStatusChange(e.target.value as ColumnStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority (MoSCoW) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    MoSCoW Priority
                  </label>
                  <select
                    value={editedCard.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {priorityOptions.map((pr) => (
                      <option key={pr} value={pr}>
                        {pr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Primary Owner (Required for In Progress)
                  </label>
                  <select
                    value={editedCard.assigneeId || ''}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reviewer */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Peer Reviewer (Required for Done)
                  </label>
                  <select
                    value={editedCard.reviewerId || ''}
                    onChange={(e) => handleReviewerChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Unassigned Reviewer</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.githubUsername})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimate & Actual Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Estimate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="80"
                        value={editedCard.estimateHours}
                        onChange={(e) => {
                          const updated = { ...editedCard, estimateHours: Number(e.target.value) };
                          setEditedCard(updated);
                          onUpdateCard(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white pr-6"
                      />
                      <span className="absolute right-2.5 top-1.5 text-[11px] text-slate-500">h</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Actual
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={editedCard.actualHours || 0}
                        onChange={(e) => {
                          const updated = { ...editedCard, actualHours: Number(e.target.value) };
                          setEditedCard(updated);
                          onUpdateCard(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white pr-6"
                      />
                      <span className="absolute right-2.5 top-1.5 text-[11px] text-slate-500">h</span>
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editedCard.deadline}
                    onChange={(e) => {
                      const updated = { ...editedCard, deadline: e.target.value };
                      setEditedCard(updated);
                      onUpdateCard(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Dependencies */}
                {editedCard.dependencies.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Dependencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {editedCard.dependencies.map((dep) => (
                        <span key={dep} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded border border-slate-700">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'traceability' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  GitHub Traceability Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Lab Manual requirement: Trace work from a task card to a GitHub issue, branch, commit, and pull request.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub Issue */}
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-between">
                    <span>1. GitHub Issue</span>
                    {editedCard.githubIssueNumber && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded">
                        Linked
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-bold text-white">
                      #{editedCard.githubIssueNumber || 'Not created'}
                    </span>
                    {editedCard.githubIssueUrl && (
                      <a
                        href={editedCard.githubIssueUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        View Issue <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Auto-generated from Board Card {editedCard.id}: "{editedCard.title}"
                  </p>
                </div>

                {/* Git Branch */}
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
                    <span>2. Git Branch</span>
                    <span className="text-[10px] text-slate-400">Convention: feature/&lt;issue&gt;-&lt;name&gt;</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2 py-1 rounded border border-purple-800">
                      {editedCard.githubBranch || `feature/${editedCard.githubIssueNumber || 'x'}-${editedCard.id.toLowerCase()}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Branched from protected <code className="text-slate-300 font-mono">main</code> branch.
                  </p>
                </div>

                {/* Commit */}
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    3. Commit Hash & Message
                  </span>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      {editedCard.commitHash || 'Pending commit'}
                    </span>
                    <p className="text-xs text-slate-300 font-mono italic pt-1">
                      feat({editedCard.id.split('-')[0].toLowerCase()}): {editedCard.title.toLowerCase()} (#{editedCard.githubIssueNumber || '12'})
                    </p>
                  </div>
                </div>

                {/* Pull Request */}
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                    <span>4. Pull Request & Review</span>
                    {editedCard.githubPrNumber && (
                      <span className="text-xs text-cyan-300 font-mono">PR #{editedCard.githubPrNumber}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-200">
                      {editedCard.githubPrUrl ? (
                        <a
                          href={editedCard.githubPrUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-cyan-300 flex items-center gap-1"
                        >
                          PR #{editedCard.githubPrNumber}: References #{editedCard.githubIssueNumber} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        'No PR open yet'
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Peer reviewer: {reviewer?.name || 'Assigned prior to merge'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Lab Manual Rule: Tasks Cannot Enter Done Without Review & Verification Evidence
                </div>
                <p className="text-xs text-slate-300">
                  Ensure automated test pass results, peer review approval findings, and artifact logs are recorded prior to closing out this card.
                </p>
              </div>

              <form onSubmit={handleVerificationSave} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Verified / Reviewed By</label>
                    <input
                      type="text"
                      value={editedCard.verificationEvidence?.verifiedBy || (reviewer?.name || 'Peer Reviewer')}
                      onChange={(e) => {
                        const updated = {
                          ...editedCard,
                          verificationEvidence: {
                            ...(editedCard.verificationEvidence || { verifiedAt: new Date().toLocaleString(), testPassed: true, notes: '' }),
                            verifiedBy: e.target.value,
                          },
                        };
                        setEditedCard(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Verification Timestamp</label>
                    <input
                      type="text"
                      value={editedCard.verificationEvidence?.verifiedAt || '2026-10-10 16:45 PST'}
                      onChange={(e) => {
                        const updated = {
                          ...editedCard,
                          verificationEvidence: {
                            ...(editedCard.verificationEvidence || { verifiedBy: 'Reviewer', testPassed: true, notes: '' }),
                            verifiedAt: e.target.value,
                          },
                        };
                        setEditedCard(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Automated Test Suite Output Log</label>
                  <textarea
                    rows={2}
                    value={editedCard.verificationEvidence?.testSuiteRun || 'npm test -- --grep "feature" -> ALL 14 PASS'}
                    onChange={(e) => {
                      const updated = {
                        ...editedCard,
                        verificationEvidence: {
                          ...(editedCard.verificationEvidence || { verifiedBy: 'Reviewer', verifiedAt: 'Now', testPassed: true, notes: '' }),
                          testSuiteRun: e.target.value,
                        },
                      };
                      setEditedCard(updated);
                    }}
                    className="w-full bg-slate-900 font-mono text-xs border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Peer Review Findings & Evidence Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Document peer review remarks, edge-case validation, and verification evidence..."
                    value={editedCard.verificationEvidence?.notes || ''}
                    onChange={(e) => {
                      const updated = {
                        ...editedCard,
                        verificationEvidence: {
                          ...(editedCard.verificationEvidence || { verifiedBy: 'Reviewer', verifiedAt: 'Now', testPassed: true }),
                          notes: e.target.value,
                        },
                      };
                      setEditedCard(updated);
                    }}
                    className="w-full bg-slate-900 text-xs border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={editedCard.verificationEvidence?.testPassed ?? true}
                      onChange={(e) => {
                        const updated = {
                          ...editedCard,
                          verificationEvidence: {
                            ...(editedCard.verificationEvidence || { verifiedBy: 'Reviewer', verifiedAt: 'Now', notes: '' }),
                            testPassed: e.target.checked,
                          },
                        };
                        setEditedCard(updated);
                      }}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Verification passed all acceptance criteria & quality benchmarks</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg shadow transition"
                  >
                    Save Verification Evidence
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Card ID: <strong className="text-slate-200">{editedCard.id}</strong> • Sprint 1 Workspace
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
