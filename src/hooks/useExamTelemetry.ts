import { useState, useEffect, useRef, useCallback } from 'react';
import { TelemetryEvent, QuestionTimingRecord, QuestionDifficulty } from '../types';

interface UseExamTelemetryOptions {
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  studentName: string;
}

export function useExamTelemetry({
  assessmentId,
  assessmentTitle,
  studentId,
  studentName,
}: UseExamTelemetryOptions) {
  const [totalAwaySeconds, setTotalAwaySeconds] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fleetingAbsencesCount, setFleetingAbsencesCount] = useState(0);
  const [pasteFloodDetected, setPasteFloodDetected] = useState(false);
  const [eventsLog, setEventsLog] = useState<TelemetryEvent[]>([]);
  const [questionTiming, setQuestionTiming] = useState<QuestionTimingRecord[]>([]);
  const [currentQuestionStart, setCurrentQuestionStart] = useState<number>(Date.now());
  const [activeQuestionId, setActiveQuestionId] = useState<string>('');
  const [activeQuestionDifficulty, setActiveQuestionDifficulty] = useState<QuestionDifficulty>('Easy');

  const blurTimestampRef = useRef<number | null>(null);

  const addEvent = useCallback((event: Omit<TelemetryEvent, 'id' | 'timestamp'>) => {
    const newEv: TelemetryEvent = {
      ...event,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setEventsLog((prev) => [newEv, ...prev]);
  }, []);

  // Smart Grace Period & Tab Tracking (Window Blur & Focus Listeners)
  useEffect(() => {
    const handleBlur = () => {
      blurTimestampRef.current = Date.now();
    };

    const handleFocus = () => {
      if (blurTimestampRef.current !== null) {
        const awayMs = Date.now() - blurTimestampRef.current;
        const awaySec = Math.round((awayMs / 1000) * 10) / 10;
        blurTimestampRef.current = null;

        // SMART GRACE PERIOD: Fleeting absence under 3 seconds is harmless misclick
        if (awayMs < 3000) {
          setFleetingAbsencesCount((prev) => prev + 1);
          addEvent({
            type: 'fleeting_absence',
            durationSeconds: awaySec,
            description: `Fleeting absence (${awaySec}s) — Ignored by Smart Grace Period`,
            riskWeight: 0,
          });
        } else {
          // PROLONGED ABSENCE: Flagged and accumulated
          setTabSwitchCount((prev) => prev + 1);
          setTotalAwaySeconds((prev) => Math.round((prev + awaySec) * 10) / 10);
          addEvent({
            type: 'tab_switch',
            durationSeconds: awaySec,
            description: `Prolonged absence detected (${awaySec}s outside test window)`,
            riskWeight: Math.min(50, Math.round(awaySec * 5)),
          });
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      } else {
        handleFocus();
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [addEvent]);

  // Keystroke & Clipboard Integrity
  const handlePasteEvent = useCallback((pastedText: string) => {
    if (pastedText.length >= 40) {
      setPasteFloodDetected(true);
      addEvent({
        type: 'paste_flood',
        description: `Rapid paste flood detected (${pastedText.length} characters inserted instantly)`,
        riskWeight: 35,
      });
    }
  }, [addEvent]);

  const handleContextMenuAttempt = useCallback(() => {
    addEvent({
      type: 'right_click_attempt',
      description: 'Right-click context menu copy attempt blocked by integrity shield',
      riskWeight: 10,
    });
  }, [addEvent]);

  // Per-Question Timestamps
  const recordQuestionStart = useCallback((qId: string, prompt: string, difficulty: QuestionDifficulty) => {
    setActiveQuestionId(qId);
    setActiveQuestionDifficulty(difficulty);
    setCurrentQuestionStart(Date.now());
    addEvent({
      type: 'question_start',
      description: `Started ${difficulty} tier question: "${prompt.slice(0, 45)}..."`,
      riskWeight: 0,
    });
  }, [addEvent]);

  const recordQuestionAnswer = useCallback((qId: string, prompt: string, difficulty: QuestionDifficulty) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - currentQuestionStart) / 1000));
    // Check anomalous speed (e.g. Hard answered in < 5 seconds)
    const anomalous = (difficulty === 'Hard' && elapsedSeconds < 5) || (difficulty === 'Medium' && elapsedSeconds < 3);

    const timingRecord: QuestionTimingRecord = {
      questionId: qId,
      questionPrompt: prompt,
      difficulty,
      timeSpentSeconds: elapsedSeconds,
      anomalousSpeed: anomalous,
    };

    setQuestionTiming((prev) => [...prev.filter((t) => t.questionId !== qId), timingRecord]);

    addEvent({
      type: 'question_answer',
      durationSeconds: elapsedSeconds,
      description: `Answered ${difficulty} question in ${elapsedSeconds}s${anomalous ? ' — Anomalous Speed Flagged' : ''}`,
      riskWeight: anomalous ? 30 : 0,
    });
  }, [currentQuestionStart, addEvent]);

  // Compute live behavioral risk score (0 - 100)
  const anomalousCount = questionTiming.filter((q) => q.anomalousSpeed).length;
  let riskScore = 0;
  riskScore += tabSwitchCount * 25;
  riskScore += Math.min(30, Math.round(totalAwaySeconds * 3));
  if (pasteFloodDetected) riskScore += 35;
  riskScore += anomalousCount * 25;
  riskScore = Math.min(100, riskScore);

  const riskTier: 'Clean' | 'Needs Watching' = riskScore >= 35 ? 'Needs Watching' : 'Clean';

  return {
    totalAwaySeconds,
    tabSwitchCount,
    fleetingAbsencesCount,
    pasteFloodDetected,
    riskScore,
    riskTier,
    eventsLog,
    questionTiming,
    recordQuestionStart,
    recordQuestionAnswer,
    handlePasteEvent,
    handleContextMenuAttempt,
  };
}
