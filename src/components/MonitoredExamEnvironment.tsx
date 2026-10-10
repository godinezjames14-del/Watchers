import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Eye,
  ChevronRight
} from 'lucide-react';
import { TarsierEyeLogo } from './TarsierEyeLogo';
import { useExamTelemetry } from '../hooks/useExamTelemetry';
import { MicroDefenseModal } from './MicroDefenseModal';
import { RAGQuizQuestion } from '../types';

interface MonitoredExamEnvironmentProps {
  assessmentTitle?: string;
  subjectCode?: string;
  studentId?: string;
  studentName?: string;
  onExit: () => void;
  onCompleteExam?: (results: any) => void;
}

export const MonitoredExamEnvironment: React.FC<MonitoredExamEnvironmentProps> = ({
  assessmentTitle = 'Quiz 1: Asymptotic Big-O & Amortized Analysis',
  subjectCode = 'CS 101',
  studentId = '2023-08492-MN',
  studentName = 'James Godinez',
  onExit,
  onCompleteExam,
}) => {
  // Sample grounded questions with difficulty tiers
  const questions: RAGQuizQuestion[] = [
    {
      id: 'q-1',
      prompt: 'Under asymptotic algorithmic analysis, what is the formal definition of Big-O upper bound?',
      options: [
        'f(n) <= c * g(n) for all n >= n_0, where c > 0 and n_0 >= 1',
        'f(n) >= c * g(n) for all n >= n_0',
        'f(n) = g(n) for all n in the domain',
        'f(n) strictly approaches zero as n approaches infinity',
      ],
      correctAnswerIndex: 0,
      difficulty: 'Easy',
    },
    {
      id: 'q-2',
      prompt: 'When dynamic arrays double in capacity upon filling, what is the amortized cost per append operation?',
      options: [
        'O(1) amortized time through potential token banking',
        'O(n) linear time per individual insertion',
        'O(log n) logarithmic time across all reallocations',
        'O(n^2) quadratic space-time trade-off',
      ],
      correctAnswerIndex: 0,
      difficulty: 'Medium',
    },
    {
      id: 'q-3',
      prompt: 'In iterative tree traversal using an explicit heap stack, why is call-stack overflow prevented for skewed trees of depth 10,000+?',
      options: [
        'Heap memory space is limited only by virtual memory, avoiding OS thread stack allocation caps (typically 8MB)',
        'Iterative algorithms eliminate all CPU register usage entirely',
        'Skewed trees automatically rotate into balanced red-black trees',
        'Heap allocations bypass CPU instruction pipelining',
      ],
      correctAnswerIndex: 0,
      difficulty: 'Hard',
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [writtenReasoning, setWrittenReasoning] = useState<string>('');
  const [isMicroDefenseOpen, setIsMicroDefenseOpen] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);

  // Live Telemetry Hook with Smart Grace Period
  const telemetry = useExamTelemetry({
    assessmentId: 'exam-monitored-live',
    assessmentTitle,
    studentId,
    studentName,
  });

  const currentQ = questions[currentQuestionIndex];

  // Per-question start timestamp tracking
  useEffect(() => {
    if (currentQ && !isExamFinished) {
      telemetry.recordQuestionStart(currentQ.id, currentQ.prompt, currentQ.difficulty);
    }
  }, [currentQuestionIndex, isExamFinished]);

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optIndex }));
    telemetry.recordQuestionAnswer(currentQ.id, currentQ.prompt, currentQ.difficulty);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finish exam
      handleFinishExam();
    }
  };

  const handleFinishExam = () => {
    setIsExamFinished(true);

    // If student triggered anti-cheat telemetry ("Needs Watching"), auto-escalate to Micro-Defense
    if (telemetry.riskTier === 'Needs Watching' || telemetry.tabSwitchCount > 0) {
      setIsMicroDefenseOpen(true);
    } else if (onCompleteExam) {
      onCompleteExam({
        score: 30,
        maxScore: 30,
        telemetry,
      });
    }
  };

  const handleDefenseCompleted = (defenseText: string, verified: boolean) => {
    setIsMicroDefenseOpen(false);
    if (onCompleteExam) {
      onCompleteExam({
        score: 30,
        maxScore: 30,
        telemetry: {
          ...telemetry,
          microDefenseTriggered: true,
          microDefenseAnswer: defenseText,
          microDefenseVerified: verified,
        },
      });
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto px-4 py-8 space-y-6 select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        telemetry.handleContextMenuAttempt();
      }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Top Banner: Subtle "Actively Monitored" with Tarsier Eye Emblem */}
      <div className="flex items-center justify-between p-3.5 px-5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <div className="flex items-center gap-3">
          <TarsierEyeLogo size={24} />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">
              Actively Monitored Session
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono">
              Smart Grace Period & Cadence Integrity Active
            </span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="text-slate-400 hover:text-slate-200 text-xs transition"
        >
          Exit Exam
        </button>
      </div>

      {/* Main Testing Container */}
      {!isExamFinished ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-amber-400 font-semibold">{subjectCode}</span>
                <span aria-hidden="true">·</span>
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-100 mt-1">
                {assessmentTitle}
              </h2>
            </div>

            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
              currentQ.difficulty === 'Easy'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                : currentQ.difficulty === 'Medium'
                ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
            }`}>
              {currentQ.difficulty} Tier
            </span>
          </div>

          {/* Question Prompt */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <p className="text-base text-slate-100 font-medium leading-relaxed">
              {currentQ.prompt}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/80 text-amber-100 font-medium'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-semibold text-xs ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Written Reasoning Box (Monitors typing cadence & paste flood) */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-medium text-slate-400 block">
              Step-by-Step Computational Justification:
            </label>
            <textarea
              rows={3}
              value={writtenReasoning}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length - writtenReasoning.length >= 40) {
                  telemetry.handlePasteEvent(val);
                }
                setWrittenReasoning(val);
              }}
              placeholder="Explain the theoretical justification for your chosen answer..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition disabled:opacity-40"
            >
              <span>{currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Completion View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-100">
            Assessment Submitted Successfully
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your answers and telemetry audit logs have been recorded under Watchers Learning Integrity standards.
          </p>

          <div className="pt-4">
            <button
              onClick={onExit}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Return to Enrolled Subjects
            </button>
          </div>
        </div>
      )}

      {/* Micro-Defense Modal Escalation */}
      <MicroDefenseModal
        isOpen={isMicroDefenseOpen}
        onClose={() => setIsMicroDefenseOpen(false)}
        questionPrompt={currentQ.prompt}
        studentAnswer={currentQ.options[selectedAnswers[currentQuestionIndex] || 0] + (writtenReasoning ? ` — Reasoning: ${writtenReasoning}` : '')}
        suspicionReason="Window blur / prolonged absence detected during testing"
        onDefenseComplete={handleDefenseCompleted}
      />
    </div>
  );
};
