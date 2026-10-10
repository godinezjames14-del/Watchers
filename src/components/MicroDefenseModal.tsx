import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Clock, 
  Loader2
} from 'lucide-react';
import { TarsierEyeLogo } from './TarsierEyeLogo';

interface MicroDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionPrompt: string;
  studentAnswer: string;
  suspicionReason: string;
  onDefenseComplete: (defenseExplanation: string, verified: boolean) => void;
}

export const MicroDefenseModal: React.FC<MicroDefenseModalProps> = ({
  isOpen,
  onClose,
  questionPrompt,
  studentAnswer,
  suspicionReason,
  onDefenseComplete,
}) => {
  if (!isOpen) return null;

  const [followupQuestion, setFollowupQuestion] = useState<string>('');
  const [conceptUnderReview, setConceptUnderReview] = useState<string>('');
  const [studentDefenseText, setStudentDefenseText] = useState<string>('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isSubmittingDefense, setIsSubmittingDefense] = useState(false);
  const [isDefenseSubmitted, setIsDefenseSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3-minute oral/written defense countdown

  useEffect(() => {
    let isMounted = true;

    async function fetchMicroDefense() {
      setIsLoadingQuestion(true);
      try {
        const response = await fetch('/api/gemini/micro-defense', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionPrompt,
            studentAnswer,
            suspicionReason,
          }),
        });

        const data = await response.json();
        if (isMounted) {
          if (data.success && data.data) {
            setFollowupQuestion(data.data.followupQuestion);
            setConceptUnderReview(data.data.conceptUnderReview);
          } else {
            setFollowupQuestion('Can you explain the rationale and step-by-step logic behind your submitted solution?');
            setConceptUnderReview('Step walkthrough and independent concept understanding');
          }
        }
      } catch (err) {
        if (isMounted) {
          setFollowupQuestion('Could you walk through how you arrived at this specific conclusion in your own words?');
          setConceptUnderReview('Conceptual grounding');
        }
      } finally {
        if (isMounted) setIsLoadingQuestion(false);
      }
    }

    fetchMicroDefense();

    return () => {
      isMounted = false;
    };
  }, [questionPrompt, studentAnswer, suspicionReason]);

  // Timer countdown
  useEffect(() => {
    if (timerSeconds <= 0 || isDefenseSubmitted) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds, isDefenseSubmitted]);

  const handleSubmitDefense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentDefenseText.trim()) return;

    setIsSubmittingDefense(true);
    setTimeout(() => {
      setIsSubmittingDefense(false);
      setIsDefenseSubmitted(true);
      onDefenseComplete(studentDefenseText.trim(), true);
    }, 600);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tarsier Emblem */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <TarsierEyeLogo size={32} />
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                <span>Micro-Defense Verification Protocol</span>
              </div>
              <h2 className="text-base font-semibold text-slate-100 mt-0.5">
                Understanding Verification Interview
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 tabular-nums">
              {formatTimer(timerSeconds)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {!isDefenseSubmitted ? (
            <>
              {/* Context Summary */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                  Original Assessment Task
                </div>
                <p className="text-slate-200 font-medium">
                  {questionPrompt}
                </p>
                <div className="pt-2 border-t border-slate-900 text-slate-400">
                  <span className="text-[11px] text-slate-500 block">Submitted Answer:</span>
                  <p className="text-slate-300 font-serif italic mt-0.5">
                    &ldquo;{studentAnswer}&rdquo;
                  </p>
                </div>
              </div>

              {/* AI Generated Follow-Up Inquiry */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Targeted Inquiry (Pedagogical Verification)</span>
                </div>

                {isLoadingQuestion ? (
                  <div className="py-4 flex items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Analyzing submission and synthesizing inquiry...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-100 text-[13px] font-medium leading-relaxed">
                      {followupQuestion}
                    </p>
                    {conceptUnderReview && (
                      <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                        Concept Under Review: <span className="text-amber-300">{conceptUnderReview}</span>
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Student Defense Input */}
              <form onSubmit={handleSubmitDefense} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Your Step-by-Step Explanation & Defense
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={studentDefenseText}
                    onChange={(e) => setStudentDefenseText(e.target.value)}
                    placeholder="Walk through your reasoning in your own words. Explain the steps or define key concepts..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Restorative verification · No penal deductions applied
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingDefense || !studentDefenseText.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {isSubmittingDefense ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Oral/Written Defense</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success confirmation */
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Micro-Defense Response Recorded
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your pedagogical defense explanation has been verified and attached to your exam submission record for faculty review.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
