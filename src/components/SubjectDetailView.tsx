import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Play, ShieldCheck } from 'lucide-react';
import { CourseSubject, AssessmentItem } from '../types';
import { MonitoredExamEnvironment } from './MonitoredExamEnvironment';

interface SubjectDetailViewProps {
  course: CourseSubject;
  onBack: () => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  course,
  onBack,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'quiz' | 'activity' | 'major_exam'>('all');
  const [activeMonitoredQuiz, setActiveMonitoredQuiz] = useState<AssessmentItem | null>(null);

  const assessments = course.assessments || [];

  // Compute Sum of Scores and Percentages
  const totalEarned = assessments.reduce((acc, item) => acc + item.score, 0);
  const totalMax = assessments.reduce((acc, item) => acc + item.maxScore, 0);
  const overallPercentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

  // Compute Percentile Rank relative to Class Average
  const classAvg = course.classAveragePercentage || 78;
  const deltaFromAvg = overallPercentage - classAvg;
  let percentileRank = 50 + Math.round(deltaFromAvg * 2.8);
  percentileRank = Math.min(99, Math.max(15, percentileRank));

  // Academic standing / Philippine collegiate scale
  const standingDesc =
    percentileRank >= 90
      ? 'Top 10% of Section · High Honors'
      : percentileRank >= 75
      ? 'Top 25% of Section · Above Average'
      : percentileRank >= 50
      ? 'Average Section Standing'
      : 'Supplemental Review Recommended';

  const philGrade =
    overallPercentage >= 96
      ? '1.00 (Excellent)'
      : overallPercentage >= 93
      ? '1.25 (Superior)'
      : overallPercentage >= 89
      ? '1.50 (Very Good)'
      : overallPercentage >= 85
      ? '1.75 (Good)'
      : overallPercentage >= 80
      ? '2.00 (Satisfactory)'
      : '2.50 (Passing)';

  const filteredItems = assessments.filter((item) => {
    if (activeFilter !== 'all' && item.type !== activeFilter) return false;
    return true;
  });

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'Quiz';
      case 'activity':
        return 'Activity';
      case 'major_exam':
        return 'Major Exam';
      default:
        return type;
    }
  };

  const quizzesCount = assessments.filter((a) => a.type === 'quiz').length;
  const activitiesCount = assessments.filter((a) => a.type === 'activity').length;
  const examsCount = assessments.filter((a) => a.type === 'major_exam').length;

  // If student started monitored testing environment
  if (activeMonitoredQuiz) {
    return (
      <MonitoredExamEnvironment
        assessmentTitle={activeMonitoredQuiz.title}
        subjectCode={course.code}
        onExit={() => setActiveMonitoredQuiz(null)}
        onCompleteExam={() => setActiveMonitoredQuiz(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Return Button & Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Enrolled Subjects</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Join Code: <strong className="text-amber-400">{course.joinCode}</strong>
        </span>
      </div>

      {/* Subject Title & Instructor Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-amber-400 font-semibold">{course.code}</span>
          <span aria-hidden="true">·</span>
          <span>{course.section}</span>
          <span aria-hidden="true">·</span>
          <span>{course.instructor}</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
          {course.title}
        </h1>
      </div>

      {/* TOP METRICS SUMMARY: Percentile, Percentage, and Sums at the top of the list */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Academic Performance Summary
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Total Score Sum
            </span>
            <span className="text-xl font-semibold text-slate-100 tabular-nums">
              {totalEarned} / {totalMax} <span className="text-xs font-normal text-slate-400">pts</span>
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Across all {assessments.length} requirements
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Overall Percentage
            </span>
            <span className="text-xl font-semibold text-slate-100 tabular-nums">
              {overallPercentage.toFixed(1)}%
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Grade: <strong className="text-slate-200">{philGrade}</strong>
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Class Percentile
            </span>
            <span className="text-xl font-semibold text-amber-400 tabular-nums">
              {percentileRank}th Percentile
            </span>
            <span className="block text-[11px] text-amber-300/80 mt-0.5">
              {standingDesc}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Section Benchmark
            </span>
            <span className="text-xl font-semibold text-slate-300 tabular-nums">
              {classAvg}% <span className="text-xs font-normal text-slate-500">mean</span>
            </span>
            <span className="block text-[11px] text-emerald-400 mt-0.5">
              +{deltaFromAvg.toFixed(1)}% above class avg
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`pb-3 font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Requirements ({assessments.length})
            </button>
            <button
              onClick={() => setActiveFilter('quiz')}
              className={`pb-3 font-medium transition-colors ${
                activeFilter === 'quiz'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quizzes ({quizzesCount})
            </button>
            <button
              onClick={() => setActiveFilter('activity')}
              className={`pb-3 font-medium transition-colors ${
                activeFilter === 'activity'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Activities ({activitiesCount})
            </button>
            <button
              onClick={() => setActiveFilter('major_exam')}
              className={`pb-3 font-medium transition-colors ${
                activeFilter === 'major_exam'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Major Exams ({examsCount})
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Showing {filteredItems.length} of {assessments.length} assessments
          </span>
        </div>

        {/* Minimalist Assessments Table */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Assessment Title</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Score</th>
                <th className="py-3 px-4 font-medium text-right">Percentage</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No assessments recorded in this category.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const pct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatTypeLabel(item.type)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] tabular-nums">
                        {item.date || item.dateSubmitted || 'Active'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-200 tabular-nums">
                        {item.score} / {item.maxScore} pts
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-amber-400 tabular-nums">
                        {pct.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveMonitoredQuiz(item)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-800/40 hover:bg-amber-950/30 transition inline-flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 fill-amber-400" />
                          <span>Launch Test</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
