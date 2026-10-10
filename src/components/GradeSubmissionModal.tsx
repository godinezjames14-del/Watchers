import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { StudentSubmission } from '../types';

interface GradeSubmissionModalProps {
  submission: StudentSubmission | null;
  onClose: () => void;
  onSaveGrade: (submissionId: string, score: number, feedback: string) => void;
}

export const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  submission,
  onClose,
  onSaveGrade,
}) => {
  if (!submission) return null;

  const [scoreInput, setScoreInput] = useState<number>(
    submission.scoreEarned ?? Math.round(submission.maxScore * 0.9)
  );
  const [feedbackInput, setFeedbackInput] = useState<string>(
    submission.teacherFeedback || 'Well structured work. Demonstrated clear conceptual understanding.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGrade(submission.id, Number(scoreInput), feedbackInput.trim());
    onClose();
  };

  const percentage = Math.round((Number(scoreInput) / submission.maxScore) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-semibold">{submission.subjectCode}</span>
              <span aria-hidden="true">·</span>
              <span>{submission.studentName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">ID {submission.studentId}</span>
            </div>
            <h2 className="text-base font-semibold text-slate-100 mt-1">
              Grade: {submission.assessmentTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Submission Preview Card */}
          <div className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Submitted Work</span>
              <span className="font-mono text-[11px] text-slate-500">{submission.submittedAt}</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-serif text-[13px] bg-slate-900/50 p-2.5 rounded border border-slate-800">
              &ldquo;{submission.workText || submission.submissionExcerpt || 'Submitted work'}&rdquo;
            </p>
          </div>

          {/* Score Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Score Earned (Max: {submission.maxScore})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={submission.maxScore}
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-semibold focus:outline-none focus:border-amber-400 tabular-nums text-sm"
                />
                <span className="text-slate-400 font-mono">/ {submission.maxScore}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Computed Percentage
              </label>
              <div className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 font-semibold text-sm tabular-nums">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Instructor Feedback & Comments
            </label>
            <textarea
              rows={3}
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              placeholder="Add feedback for the student..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition"
            >
              Save Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
