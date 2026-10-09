import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  School, 
  IdCard, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  Sparkles,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { defaultUsers } from '../data/studyData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('godinezjames14@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [loginRole, setLoginRole] = useState<UserRole>('student');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regInstitution, setRegInstitution] = useState('University of the Philippines Diliman');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Demo Login
  const handleQuickLogin = (demoUser: UserAccount) => {
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Look up user or authenticate demo
    const found = defaultUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    if (found) {
      onLoginSuccess(found);
      onClose();
    } else {
      // Create authenticated session with provided email
      const newSession: UserAccount = {
        id: `user-${Date.now()}`,
        name: loginEmail.split('@')[0].replace('.', ' '),
        email: loginEmail,
        role: loginRole,
        institution: 'Philippine Academic Institution',
        studentOrFacultyId: loginRole === 'student' ? '2024-9102-MN' : 'FAC-9912',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        enrolledCoursesCount: 4,
        verifiedConceptsCount: 8,
        joinedDate: 'October 2026',
      };
      onLoginSuccess(newSession);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!privacyAgreed) {
      setErrorMsg('You must agree to the Philippine Data Privacy Act RA 10173 policy terms to register.');
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      institution: regInstitution,
      studentOrFacultyId: regIdNumber.trim() || (regRole === 'student' ? '2026-0012-MN' : 'FAC-0081'),
      avatar: regRole === 'teacher' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      enrolledCoursesCount: regRole === 'student' ? 4 : 3,
      verifiedConceptsCount: 0,
      joinedDate: 'October 2026',
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-600/30">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">WATCHERS</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Learning Integrity
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'login' ? 'Sign in to access your dashboard & study area' : 'Create an institutional account'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3.5 border-b-2 flex items-center justify-center gap-2 transition ${
              mode === 'login'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In (Login)</span>
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-3.5 border-b-2 flex items-center justify-center gap-2 transition ${
              mode === 'register'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Buttons */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Demo Logins (One-Click)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin(defaultUsers[0])}
                className="p-2.5 bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700/60 rounded-xl text-left transition flex items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white group-hover:text-indigo-200 truncate">James (Student)</div>
                  <div className="text-[10px] text-slate-400 truncate">Study & Quizzes</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(defaultUsers[1])}
                className="p-2.5 bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-700/60 rounded-xl text-left transition flex items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white group-hover:text-purple-200 truncate">Prof. Ramirez</div>
                  <div className="text-[10px] text-slate-400 truncate">Classes & Policies</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(defaultUsers[3] || {
                  id: 'user-admin-1',
                  name: 'Lead Admin & Workspace Manager',
                  email: 'admin@watchers.edu.ph',
                  role: 'admin',
                  institution: 'Watchers DevTeam / SPD Lab Evaluation',
                  studentOrFacultyId: 'ADM-2026-LEAD',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
                  enrolledCoursesCount: 6,
                  verifiedConceptsCount: 140,
                  joinedDate: 'October 2026',
                })}
                className="p-2.5 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700/60 rounded-xl text-left transition flex items-center gap-2 group sm:col-span-1 border-emerald-900/40"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white group-hover:text-emerald-200 truncate">Admin Lead</div>
                  <div className="text-[10px] text-emerald-400 truncate font-semibold">Workspace & Git Hub</div>
                </div>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Role Picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Educational Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setLoginRole(r)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                        loginRole === r
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r === 'admin' ? 'Admin Only' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@university.edu.ph"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo prototype: Any password or one-click demo login grants access.')}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Sign In to Dashboard & Study Area</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Educational Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRegRole(r);
                        if (r === 'admin') {
                          setRegInstitution('Watchers DevTeam / Lab Evaluation');
                          setRegIdNumber('ADM-2026-LEAD');
                        }
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                        regRole === r
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r === 'admin' ? 'Admin Only' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g., James Godinez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@up.edu.ph"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Institution / University */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  School / Higher Education Institution
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regInstitution}
                    onChange={(e) => setRegInstitution(e.target.value)}
                    placeholder="University of the Philippines Diliman"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Student ID / Faculty ID */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {regRole === 'student' ? 'Student ID Number' : 'Faculty ID Number'}
                </label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    placeholder={regRole === 'student' ? '2023-08492-MN' : 'FAC-2018-041'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Privacy Consent Checkbox (RA 10173 Requirement) */}
              <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I consent to the processing of academic assessment data in strict compliance with the <strong>Philippine Data Privacy Act (RA 10173)</strong>. Contextual telemetry is strictly non-punitive and purged after 90 days.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Complete Registration & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
