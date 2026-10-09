import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { CourseSubject } from '../types';
import { availableCourseCatalog, mockCourses } from '../data/studyData';

interface EnrollCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrolledCourseCodes: string[];
  onEnrollSuccess: (newCourse: CourseSubject) => void;
}

export const EnrollCourseModal: React.FC<EnrollCourseModalProps> = ({
  isOpen,
  onClose,
  enrolledCourseCodes,
  onEnrollSuccess,
}) => {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCourse, setSuccessCourse] = useState<CourseSubject | null>(null);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessCourse(null);

    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg('Please enter a valid subject code.');
      return;
    }

    const allKnown = [...mockCourses, ...availableCourseCatalog];
    const match = allKnown.find(
      (c) => c.joinCode.toUpperCase() === cleanCode || c.code.replace(/\s+/g, '').toUpperCase() === cleanCode
    );

    if (!match) {
      setErrorMsg(`Code "${cleanCode}" was not found. Please verify the code from your instructor.`);
      return;
    }

    if (enrolledCourseCodes.includes(match.code)) {
      setErrorMsg(`You are already enrolled in ${match.code}: ${match.title}.`);
      return;
    }

    setSuccessCourse(match);
    onEnrollSuccess(match);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Enroll with Instructor Code
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter the join code provided by your professor
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-900/60 text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successCourse && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-900/60 text-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Enrolled in {successCourse.code} ({successCourse.title})</span>
            </div>
          )}

          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Subject Join Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CS101A or CS150A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 font-mono text-sm tracking-wider text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80 space-y-2">
              <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-mono">
                Sample Instructor Codes:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {['CS101A', 'ENG202A', 'MATH110A', 'CS150A', 'CS103B'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => { setInputCode(code); setErrorMsg(null); }}
                    className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
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
                Enroll Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
