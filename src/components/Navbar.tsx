import React from 'react';
import { 
  LayoutDashboard, 
  ListTree, 
  Github, 
  GitBranch, 
  CalendarRange, 
  FileCheck2, 
  Eye, 
  Brain, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  LogIn 
} from 'lucide-react';
import { TarsierEyeLogo } from './TarsierEyeLogo';
import { UserAccount, UserRole } from '../types';
import { defaultUsers } from '../data/studyData';

export type ActiveTab = 
  | 'dashboard' 
  | 'study' 
  | 'admin_overview' 
  | 'kanban' 
  | 'backlog' 
  | 'github' 
  | 'traceability' 
  | 'sprint' 
  | 'submission' 
  | 'prototype';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  doneCardsCount: number;
  totalCardsCount: number;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (user: UserAccount) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onSwitchUser,
}) => {
  const userRole: UserRole = currentUser?.role || 'student';
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';

  // Minimalist, curated navigation items by role
  let navItems: { id: ActiveTab; label: string }[] = [];

  if (isAdmin) {
    navItems = [
      { id: 'admin_overview', label: 'Overview' },
      { id: 'kanban', label: 'Kanban Board' },
      { id: 'backlog', label: 'Backlog' },
      { id: 'github', label: 'GitHub Explorer' },
      { id: 'traceability', label: 'Traceability' },
      { id: 'sprint', label: 'Sprint' },
      { id: 'submission', label: 'Dossier' },
      { id: 'prototype', label: 'Prototype' },
    ];
  } else if (isTeacher) {
    navItems = [
      { id: 'dashboard', label: 'Teaching Sections' },
      { id: 'study', label: 'Curriculum & AI Policies' },
      { id: 'prototype', label: 'Integrity Simulator' },
    ];
  } else {
    // Student navigation
    navItems = [
      { id: 'dashboard', label: 'My Subjects' },
      { id: 'study', label: 'Study Area' },
      { id: 'prototype', label: 'Assessment Check' },
    ];
  }

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand & Endangered Tarsier Eye Emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <TarsierEyeLogo size={32} />
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-widest text-slate-100 uppercase">
              Watchers
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              · {isAdmin ? 'Admin' : isTeacher ? 'Faculty' : 'Student'}
            </span>
          </div>
        </div>

        {/* Zone 2: Minimalist Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors whitespace-nowrap py-1 ${
                  isActive
                    ? 'text-amber-400 font-semibold border-b border-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Role Switcher & User Account */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          {/* Subtle Role Switcher */}
          <div className="flex items-center bg-slate-900 rounded-md p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => onSwitchUser(defaultUsers[0])}
              className={`px-2.5 py-1 rounded transition ${
                userRole === 'student' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => onSwitchUser(defaultUsers[1])}
              className={`px-2.5 py-1 rounded transition ${
                userRole === 'teacher' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => onSwitchUser(defaultUsers[3] || defaultUsers[0])}
              className={`px-2.5 py-1 rounded transition ${
                userRole === 'admin' ? 'bg-amber-950/80 text-amber-300 font-medium border border-amber-800/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-800"
                title={currentUser.name}
              />
              <button
                onClick={onLogout}
                className="text-slate-500 hover:text-slate-300 p-1 transition"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-md text-xs transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
