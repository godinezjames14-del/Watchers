import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  User, 
  GitBranch, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TaskCard, ColumnStatus, Priority } from '../types';
import { teamMembers, epics } from '../data/mockData';
import { CardDetailModal } from './CardDetailModal';

const columns: { id: ColumnStatus; title: string; color: string; border: string; desc: string }[] = [
  { id: 'Backlog', title: 'Backlog', color: 'bg-slate-800/80 text-slate-300', border: 'border-slate-700', desc: 'Scope items awaiting sprint' },
  { id: 'To Do', title: 'To Do', color: 'bg-blue-950/60 text-blue-300', border: 'border-blue-800/60', desc: 'Committed for Sprint 1' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-amber-950/60 text-amber-300', border: 'border-amber-800/60', desc: 'Active development' },
  { id: 'For Review', title: 'For Review', color: 'bg-purple-950/60 text-purple-300', border: 'border-purple-800/60', desc: 'Peer review on PR' },
  { id: 'Testing', title: 'Testing', color: 'bg-cyan-950/60 text-cyan-300', border: 'border-cyan-800/60', desc: 'QA verification' },
  { id: 'Done', title: 'Done', color: 'bg-emerald-950/60 text-emerald-300', border: 'border-emerald-800/60', desc: 'Reviewed & verified' },
];

interface KanbanBoardProps {
  tasks: TaskCard[];
  onUpdateTasks: (tasks: TaskCard[]) => void;
  onSelectTraceCard?: (card: TaskCard) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateTasks,
  onSelectTraceCard,
}) => {
  const [selectedCard, setSelectedCard] = useState<TaskCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpicFilter, setSelectedEpicFilter] = useState<string>('all');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [sprintOnly, setSprintOnly] = useState<boolean>(false);

  // Rule violation modal state
  const [ruleViolation, setRuleViolation] = useState<{
    card: TaskCard;
    targetStatus: ColumnStatus;
    reason: string;
    ruleType: 'in_progress' | 'done';
  } | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (sprintOnly && !t.inSprint) return false;
    if (selectedEpicFilter !== 'all' && t.epicId !== selectedEpicFilter) return false;
    if (selectedMemberFilter !== 'all' && t.assigneeId !== selectedMemberFilter) return false;
    if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Strict Rule Validation Handler
  const validateAndMoveStatus = (card: TaskCard, newStatus: ColumnStatus) => {
    // RULE 1: Tasks cannot enter In Progress without an owner and acceptance criteria
    if (newStatus === 'In Progress') {
      const hasOwner = !!card.assigneeId;
      const hasCriteria = card.acceptanceCriteria && card.acceptanceCriteria.length > 0;

      if (!hasOwner || !hasCriteria) {
        setRuleViolation({
          card,
          targetStatus: newStatus,
          ruleType: 'in_progress',
          reason: !hasOwner && !hasCriteria
            ? 'Lab Rule Violation: Task has NO assigned owner and NO acceptance criteria defined.'
            : !hasOwner
            ? 'Lab Rule Violation: Task has NO assigned owner. Every in-progress card must have individual accountability.'
            : 'Lab Rule Violation: Task has NO acceptance criteria. Scope must be testable before work begins.',
        });
        return;
      }
    }

    // RULE 2: Tasks cannot enter Done without review and verification evidence
    if (newStatus === 'Done') {
      const hasReviewer = !!card.reviewerId;
      const hasEvidence = !!card.verificationEvidence && card.verificationEvidence.notes.trim().length > 0;

      if (!hasReviewer || !hasEvidence) {
        setRuleViolation({
          card,
          targetStatus: newStatus,
          ruleType: 'done',
          reason: !hasReviewer && !hasEvidence
            ? 'Lab Rule Violation: Task has NO peer reviewer and NO verification evidence recorded.'
            : !hasReviewer
            ? 'Lab Rule Violation: Task requires an assigned peer reviewer before marking as Done.'
            : 'Lab Rule Violation: Tasks cannot enter Done without test pass verification evidence & artifact logs.',
        });
        return;
      }
    }

    // Passed rules, execute move
    executeStatusMove(card.id, newStatus);
  };

  const executeStatusMove = (cardId: string, newStatus: ColumnStatus) => {
    const updated = tasks.map((t) => (t.id === cardId ? { ...t, status: newStatus } : t));
    onUpdateTasks(updated);
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard({ ...selectedCard, status: newStatus });
    }
  };

  const handleFixRuleViolation = () => {
    if (!ruleViolation) return;
    const { card, ruleType, targetStatus } = ruleViolation;

    if (ruleType === 'in_progress') {
      // Auto-assign default owner and populate baseline acceptance criteria
      const autoFixed: TaskCard = {
        ...card,
        assigneeId: card.assigneeId || teamMembers[0].id,
        acceptanceCriteria:
          card.acceptanceCriteria.length > 0
            ? card.acceptanceCriteria
            : [
                { id: `ac-${Date.now()}-1`, text: 'Feature adheres to requirements and UI design', completed: false },
                { id: `ac-${Date.now()}-2`, text: 'Passes all automated unit tests with no console errors', completed: false },
              ],
        status: targetStatus,
      };
      const updated = tasks.map((t) => (t.id === card.id ? autoFixed : t));
      onUpdateTasks(updated);
      setRuleViolation(null);
    } else if (ruleType === 'done') {
      // Auto-populate peer reviewer and test evidence
      const autoFixed: TaskCard = {
        ...card,
        reviewerId: card.reviewerId || teamMembers[2].id,
        verificationEvidence: card.verificationEvidence || {
          verifiedBy: teamMembers[2].name,
          verifiedAt: new Date().toLocaleString(),
          testPassed: true,
          notes: 'Peer review and acceptance verification completed. Clean merge with passing test suite.',
          testSuiteRun: 'npm test -> 100% passing tests',
        },
        status: targetStatus,
      };
      const updated = tasks.map((t) => (t.id === card.id ? autoFixed : t));
      onUpdateTasks(updated);
      setRuleViolation(null);
    }
  };

  const handleSingleCardUpdate = (updatedCard: TaskCard) => {
    const newTasks = tasks.map((t) => (t.id === updatedCard.id ? updatedCard : t));
    onUpdateTasks(newTasks);
    setSelectedCard(updatedCard);
  };

  const handleAddNewTask = () => {
    const newId = `TASK-${String(tasks.length + 1).padStart(2, '0')}`;
    const newTask: TaskCard = {
      id: newId,
      featureId: 'feat-1',
      epicId: 'epic-1',
      title: 'New Feature Task',
      description: 'Define scope, technical approach, and dependencies.',
      userStory: 'As a user, I want this feature so that I can accomplish my workflow.',
      status: 'To Do',
      priority: 'Should Have',
      isMvp: true,
      assigneeId: teamMembers[0].id,
      reviewerId: teamMembers[1].id,
      estimateHours: 8,
      deadline: '2026-10-16',
      dependencies: [],
      inSprint: true,
      tags: ['Sprint-1'],
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Review acceptance criteria', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Implement scaffold & branch', completed: false },
      ],
      acceptanceCriteria: [
        { id: `ac-${Date.now()}-1`, text: 'Verified functionality works without regression', completed: false },
      ],
    };
    onUpdateTasks([newTask, ...tasks]);
    setSelectedCard(newTask);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Filters & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, card IDs, tags, or stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Epic Filter */}
          <select
            value={selectedEpicFilter}
            onChange={(e) => setSelectedEpicFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Epics (5)</option>
            {epics.map((ep) => (
              <option key={ep.id} value={ep.id}>
                {ep.code}: {ep.title.slice(0, 24)}...
              </option>
            ))}
          </select>

          {/* Member Filter */}
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Members ({teamMembers.length})</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities (MoSCoW)</option>
            <option value="Must Have">Must Have</option>
            <option value="Should Have">Should Have</option>
            <option value="Could Have">Could Have</option>
            <option value="Won't Have">Won't Have</option>
          </select>

          {/* Sprint 1 Only Toggle */}
          <button
            onClick={() => setSprintOnly(!sprintOnly)}
            className={`px-3 py-2 rounded-xl font-medium transition flex items-center gap-1.5 ${
              sprintOnly
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sprint 1 Only</span>
          </button>

          {/* Add Card Button */}
          <button
            onClick={handleAddNewTask}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Task Card</span>
          </button>
        </div>
      </div>

      {/* Rules Notice Callout */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-900/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-slate-300">
            <strong className="text-amber-300">Lab Manual Rules Enforced:</strong>
            <span className="ml-1.5">
              ① Tasks cannot enter <code className="text-amber-200 bg-amber-950/60 px-1 py-0.5 rounded">In Progress</code> without an owner & acceptance criteria.
            </span>
            <span className="ml-2">
              ② Tasks cannot enter <code className="text-emerald-200 bg-emerald-950/60 px-1 py-0.5 rounded">Done</code> without peer review & verification evidence.
            </span>
          </div>
        </div>
        <span className="text-slate-400 text-[11px]">
          Showing {filteredTasks.length} cards
        </span>
      </div>

      {/* 6 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const totalColHours = colTasks.reduce((acc, t) => acc + t.estimateHours, 0);

          return (
            <div
              key={col.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[580px] shadow-lg"
            >
              {/* Column Header */}
              <div className={`p-3 border-b ${col.border} ${col.color} flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <span>{col.title}</span>
                    <span className="px-1.5 py-0.5 bg-black/30 rounded-full font-mono text-[10px]">
                      {colTasks.length}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-75 font-normal mt-0.5">{col.desc}</p>
                </div>
                <span className="text-[10px] font-mono opacity-80">{totalColHours}h</span>
              </div>

              {/* Tasks List */}
              <div className="p-2 space-y-2.5 flex-1 overflow-y-auto max-h-[720px]">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 text-xs italic">
                    No cards in {col.title}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = teamMembers.find((m) => m.id === task.assigneeId);
                    const completedChecklist = task.checklist.filter((c) => c.completed).length;

                    // Priority styling
                    const priorityBadge =
                      task.priority === 'Must Have'
                        ? 'bg-red-500/10 text-red-300 border-red-500/20'
                        : task.priority === 'Should Have'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : task.priority === 'Could Have'
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                        : 'bg-slate-700/30 text-slate-400 border-slate-700';

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedCard(task)}
                        className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl p-3 shadow-md transition-all duration-200 cursor-pointer space-y-2.5 group relative"
                      >
                        {/* Top: ID + MoSCoW badge */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/60">
                            {task.id}
                          </span>
                          <div className="flex items-center gap-1">
                            {task.isMvp && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                MVP
                              </span>
                            )}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${priorityBadge}`}>
                              {task.priority.split(' ')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2 group-hover:text-indigo-200 transition">
                          {task.title}
                        </h4>

                        {/* Checklist progress */}
                        {task.checklist.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Checklist</span>
                              <span>
                                {completedChecklist}/{task.checklist.length}
                              </span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-indigo-500 h-full rounded-full transition-all"
                                style={{
                                  width: `${(completedChecklist / task.checklist.length) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Traceability Indicator */}
                        {task.githubIssueNumber && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-900/60 p-1.5 rounded border border-slate-800">
                            <GitBranch className="w-3 h-3 text-emerald-400" />
                            <span>Issue #{task.githubIssueNumber}</span>
                            {task.githubPrNumber && (
                              <span className="text-cyan-400 ml-auto">PR #{task.githubPrNumber}</span>
                            )}
                          </div>
                        )}

                        {/* Verification badge if in Done */}
                        {task.status === 'Done' && task.verificationEvidence && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">Verified: {task.verificationEvidence.verifiedBy}</span>
                          </div>
                        )}

                        {/* Footer: Assignee & Hours */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-slate-400 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            {assignee ? (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                                title={assignee.name}
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                ?
                              </div>
                            )}
                            <span className="truncate max-w-[80px]">
                              {assignee ? assignee.name.split(' ')[0] : 'Unassigned'}
                            </span>
                          </div>

                          <span className="font-mono text-slate-300 font-medium">
                            {task.estimateHours}h
                          </span>
                        </div>

                        {/* Quick Status Forward Button (visible on hover) */}
                        <div 
                          className="pt-1.5 border-t border-slate-700/40 flex justify-between items-center opacity-80 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={task.status}
                            onChange={(e) => validateAndMoveStatus(task, e.target.value as ColumnStatus)}
                            className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            {columns.map((c) => (
                              <option key={c.id} value={c.id}>
                                Move to {c.title}
                              </option>
                            ))}
                          </select>

                          {col.id !== 'Done' && (
                            <button
                              onClick={() => {
                                const currentIndex = columns.findIndex((c) => c.id === col.id);
                                if (currentIndex < columns.length - 1) {
                                  validateAndMoveStatus(task, columns[currentIndex + 1].id);
                                }
                              }}
                              title={`Advance to ${columns[columns.findIndex((c) => c.id === col.id) + 1]?.title}`}
                              className="text-[10px] text-indigo-300 hover:text-white p-1 hover:bg-indigo-600/30 rounded transition flex items-center gap-0.5"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdateCard={handleSingleCardUpdate}
          onMoveStatus={validateAndMoveStatus}
        />
      )}

      {/* Rule Violation Warning Dialog */}
      {ruleViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-amber-600/80 max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Workflow Rule Blocked: Cannot Move to "{ruleViolation.targetStatus}"
                </h3>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  Software Project Development Laboratory Manual Specification
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="text-slate-200">
                Card: <strong className="text-white">{ruleViolation.card.id} — {ruleViolation.card.title}</strong>
              </div>
              <p className="text-red-300 leading-relaxed font-medium">
                {ruleViolation.reason}
              </p>
              <div className="pt-2 text-slate-400 border-t border-slate-800 text-[11px]">
                {ruleViolation.ruleType === 'in_progress' ? (
                  <span>
                    <strong>Rule 1 Enforcement:</strong> Tasks must have a designated team member owner and at least 1 acceptance criterion before starting development.
                  </span>
                ) : (
                  <span>
                    <strong>Rule 2 Enforcement:</strong> Tasks cannot be marked Done without an assigned peer reviewer and documented test verification evidence.
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRuleViolation(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Cancel & Revert
              </button>
              <button
                onClick={handleFixRuleViolation}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg text-xs shadow-lg flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {ruleViolation.ruleType === 'in_progress'
                  ? 'Assign Lead & Add Criteria (Proceed)'
                  : 'Add Reviewer & Verify Evidence (Mark Done)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
