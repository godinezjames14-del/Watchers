import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Award,
  Layers
} from 'lucide-react';
import { AssessmentItem, AssessmentType } from '../types';

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionCode: string;
  sectionName: string;
  onAddAssessment: (newAssessment: AssessmentItem) => void;
}

export const CreateAssessmentModal: React.FC<CreateAssessmentModalProps> = ({
  isOpen,
  onClose,
  sectionCode,
  sectionName,
  onAddAssessment,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<AssessmentType>('quiz');
  const [maxScore, setMaxScore] = useState<number>(25);
  const [dueDate, setDueDate] = useState('Oct 24, 2026');
  const [aiPolicyStatus, setAiPolicyStatus] = useState('Brainstorming Only');
  const [notes, setNotes] = useState('Mandatory independent 5-minute follow-up concept verification quiz required.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const categoryName = 
      type === 'quiz' ? 'Quiz'
      : type === 'activity' ? 'Activity / Laboratory'
      : 'Major Examination';

    const newItem: AssessmentItem = {
      id: `asmt-${Date.now()}`,
      type,
      categoryName,
      title: title.trim(),
      score: 0, // initially 0 or template for section
      maxScore: Number(maxScore),
      date: dueDate,
      status: 'pending',
      aiDisclosureStatus: aiPolicyStatus,
      followupVerified: true,
      notes: notes.trim(),
    };

    onAddAssessment(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-purple-950/70 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
              {sectionCode} • {sectionName}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Create New Assessment
            </h3>
            <p className="text-xs text-slate-400">
              Add a Quiz, Activity, or Major Exam with Watchers AI disclosure policies
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-300">
          {/* Assessment Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Assessment Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'quiz', label: 'Quiz', defaultMax: 25 },
                { id: 'activity', label: 'Activity / Lab', defaultMax: 50 },
                { id: 'major_exam', label: 'Major Exam', defaultMax: 100 },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setType(opt.id as AssessmentType);
                    setMaxScore(opt.defaultMax);
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                    type === opt.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assessment Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Assessment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Quiz 4: Dynamic Programming & Memoization"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Max Points and Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Max Points
              </label>
              <input
                type="number"
                min="5"
                max="500"
                required
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Due Date / Scheduled At
              </label>
              <input
                type="text"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Oct 24, 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* AI Policy for this task */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Task AI Policy Guidelines
            </label>
            <select
              value={aiPolicyStatus}
              onChange={(e) => setAiPolicyStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Brainstorming Only">Brainstorming & Ideation Only (Drafting must be manual)</option>
              <option value="Full Citation Required">Allowed with Mandatory Prompt Transcripts & Citation</option>
              <option value="AI Prohibited">AI Prohibited (Strict manual pen-and-paper / derivations)</option>
              <option value="Open Exploration">Open AI Exploration (Follow-up oral defense weighted)</option>
            </select>
          </div>

          {/* Notes / Rubric Instructions */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Rubric Instructions & Independent Verification Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create & Assign to Section</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
