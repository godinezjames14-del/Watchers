import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CourseSubject, AssessmentItem } from '../types';

interface CourseDetailModalProps {
  course: CourseSubject | null;
  onClose: () => void;
  onTakeAssessment?: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
}) => {
  if (!course) return null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'quiz' | 'activity' | 'major_exam'>('all');

  const assessments = course.assessments || [];

  const totalEarned = assessments.reduce((acc, item) => acc + item.score, 0);
  const totalMax = assessments.reduce((acc, item) => acc + item.maxScore, 0);
  const overallPercentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

  // Percentile calculation
  const classAvg = course.classAveragePercentage || 78;
  const deltaFromAvg = overallPercentage - classAvg;
  let percentileRank = 50 + Math.round(deltaFromAvg * 2.8);
  percentileRank = Math.min(99, Math.max(15, percentileRank));

  const filteredItems = assessments.filter((item) => {
    if (activeFilter !== 'all' && item.type !== activeFilter) return false;
    return true;
  });

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'activity': return 'Activity';
      case 'major_exam': return 'Major Exam';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-semibold">{course.code}</span>
              <span aria-hidden="true">·</span>
              <span>{course.section}</span>
              <span aria-hidden="true">·</span>
              <span>{course.instructor}</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-100 mt-1">
              {course.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Category Tabs */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-4">
            {(['all', 'quiz', 'activity', 'major_exam'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`pb-3 font-medium transition-colors ${
                  activeFilter === cat
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Assessments' : cat === 'quiz' ? 'Quizzes' : cat === 'activity' ? 'Activities' : 'Major Exams'}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Join Code: {course.joinCode}
          </span>
        </div>

        {/* Assessment Items Table */}
        <div className="p-6">
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Assessment</th>
                  <th className="py-2.5 px-4 font-medium">Type</th>
                  <th className="py-2.5 px-4 font-medium">Due Date</th>
                  <th className="py-2.5 px-4 font-medium text-right">Score</th>
                  <th className="py-2.5 px-4 font-medium text-right">Percent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredItems.map((item) => {
                  const pct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {formatTypeLabel(item.type)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 tabular-nums font-mono text-[11px]">
                        {item.dateSubmitted || 'Pending'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-200 tabular-nums">
                        {item.score} / {item.maxScore}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                        {pct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Academic Totals & Percentile Summary */}
          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Total Score Sum
              </span>
              <span className="text-lg font-semibold text-slate-100 tabular-nums">
                {totalEarned} / {totalMax} <span className="text-xs font-normal text-slate-400">pts</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Overall Percentage
              </span>
              <span className="text-lg font-semibold text-slate-100 tabular-nums">
                {overallPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Class Percentile
              </span>
              <span className="text-lg font-semibold text-amber-400 tabular-nums">
                {percentileRank}th Percentile
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
