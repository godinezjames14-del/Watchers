export type Priority = 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";

export type ColumnStatus = 'Backlog' | 'To Do' | 'In Progress' | 'For Review' | 'Testing' | 'Done';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  assignedHours: number;
  capacityHours: number;
  githubUsername: string;
  tasksCount: number;
}

export interface AcceptanceCriterion {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface VerificationEvidence {
  verifiedBy: string;
  verifiedAt: string;
  testPassed: boolean;
  notes: string;
  artifactUrl?: string;
  testSuiteRun?: string;
}

export interface TaskCard {
  id: string;
  featureId: string;
  epicId: string;
  title: string;
  description: string;
  userStory: string;
  status: ColumnStatus;
  priority: Priority;
  isMvp: boolean;
  assigneeId?: string;
  reviewerId?: string;
  estimateHours: number;
  actualHours?: number;
  deadline: string;
  dependencies: string[];
  checklist: ChecklistItem[];
  acceptanceCriteria: AcceptanceCriterion[];
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  githubBranch?: string;
  githubPrNumber?: number;
  githubPrUrl?: string;
  commitHash?: string;
  verificationEvidence?: VerificationEvidence;
  tags: string[];
  inSprint: boolean;
}

export interface Epic {
  id: string;
  code: string;
  title: string;
  description: string;
  color: string;
  featuresCount: number;
  completedFeaturesCount: number;
}

export interface Feature {
  id: string;
  epicId: string;
  code: string;
  title: string;
  userStory: string;
  priority: Priority;
  isMvp: boolean;
  acceptanceCriteria: string[];
  dependencies: string[];
  estimatedHours: number;
  tasks: TaskCard[];
}

export interface GitHubIssue {
  number: number;
  title: string;
  cardId: string;
  author: string;
  state: 'open' | 'closed';
  labels: string[];
  createdAt: string;
  body: string;
  assignees: string[];
}

export interface GitHubCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  issueRef: number;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  branch: string;
  base: string;
  issueNumber: number;
  cardId: string;
  author: string;
  reviewer: string;
  status: 'open' | 'merged' | 'in_review';
  createdAt: string;
  mergedAt?: string;
  diffStats: { additions: number; deletions: number; filesChanged: number };
  reviewFindings: {
    reviewer: string;
    status: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENT';
    comment: string;
    reviewedAt: string;
  }[];
  description: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  totalEstimatedHours: number;
  completedHours: number;
  blockers: { id: string; description: string; owner: string; status: 'active' | 'resolved' }[];
}

export interface MemberContribution {
  name: string;
  role: string;
  primaryTasks: string[];
  tasksOwnedCount: number;
  prCount: number;
  reviewsCount: number;
  estimatedHours: number;
  actualHours: number;
  accountabilityScore: number;
}

export type UserRole = 'student' | 'teacher' | 'coordinator' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  studentOrFacultyId: string;
  avatar: string;
  enrolledCoursesCount: number;
  verifiedConceptsCount: number;
  joinedDate: string;
}

export type AssessmentType = 'quiz' | 'activity' | 'major_exam';

export interface AssessmentItem {
  id: string;
  type: AssessmentType;
  title: string;
  categoryName: 'Quiz' | 'Activity / Laboratory' | 'Major Examination';
  score: number;
  maxScore: number;
  date: string;
  status: 'graded' | 'submitted' | 'pending';
  aiDisclosureStatus?: string;
  followupVerified?: boolean;
  notes?: string;
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentType: AssessmentType;
  submittedAt: string;
  workText: string;
  aiToolsDeclared: string[];
  aiDisclosureNote: string;
  followupQuizScore: number;
  followupQuizMax: number;
  focusLossCount: number;
  scoreEarned: number | null;
  maxScore: number;
  status: 'graded' | 'needs_grading';
  teacherFeedback?: string;
}

export interface CourseSubject {
  id: string;
  code: string;
  title: string;
  instructor: string;
  section: string;
  joinCode: string;
  aiPolicyTier: 'brainstorming' | 'citation' | 'prohibited' | 'open';
  aiPolicyDescription: string;
  nextAssignmentDue?: string;
  activeTopic: string;
  competencyProgress: number;
  color: string;
  assessments: AssessmentItem[];
  classAveragePercentage: number;
  classTotalStudents: number;
}


export interface StudyConceptCard {
  id: string;
  subjectCode: string;
  conceptTitle: string;
  summary: string;
  masteryStatus: 'verified' | 'review_needed' | 'in_progress';
  keyQuestion: string;
  sampleIndependentAnswer: string;
  aiDisclosureGuidance: string;
}

export interface PracticeQuizQuestion {
  id: string;
  concept: string;
  prompt: string;
  sampleExpectedAnswer: string;
  rubricHint: string;
  timeLimitSeconds: number;
}

