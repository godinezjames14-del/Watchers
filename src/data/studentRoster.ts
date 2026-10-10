import { UserAccount, StudentSubmission, AssessmentType } from '../types';

export interface EnrolledStudentProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  enrolledSubjectCodes: string[];
}

export const tenNewStudents: EnrolledStudentProfile[] = [
  {
    id: 'student-sofia',
    studentId: '2024-01041-MN',
    name: 'Sofia Alcantara',
    email: 'sofia.alcantara@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
  {
    id: 'student-miguel',
    studentId: '2024-02194-MN',
    name: 'Miguel Bautista',
    email: 'miguel.bautista@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 150'],
  },
  {
    id: 'student-bea',
    studentId: '2024-03482-MN',
    name: 'Bea Valencia',
    email: 'bea.valencia@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 102', 'CS 150'],
  },
  {
    id: 'student-joshua',
    studentId: '2024-04918-MN',
    name: 'Joshua Lim',
    email: 'joshua.lim@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
  {
    id: 'student-patricia',
    studentId: '2024-05183-MN',
    name: 'Patricia Soriano',
    email: 'patricia.soriano@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 150', 'CS 101'],
  },
  {
    id: 'student-rafael',
    studentId: '2024-06721-MN',
    name: 'Rafael Dizon',
    email: 'rafael.dizon@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
  {
    id: 'student-camille',
    studentId: '2024-07834-MN',
    name: 'Camille Mendoza',
    email: 'camille.mendoza@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 102', 'CS 150'],
  },
  {
    id: 'student-ethan',
    studentId: '2024-08291-MN',
    name: 'Ethan Navarro',
    email: 'ethan.navarro@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 150'],
  },
  {
    id: 'student-nicole',
    studentId: '2024-09315-MN',
    name: 'Nicole Tanedo',
    email: 'nicole.tanedo@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 102', 'CS 150'],
  },
  {
    id: 'student-daniel',
    studentId: '2024-10482-MN',
    name: 'Daniel Villanueva',
    email: 'daniel.villanueva@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
];

// Baseline student profiles including existing ones
export const allStudentProfiles: EnrolledStudentProfile[] = [
  {
    id: 'user-student-1',
    studentId: '2023-08492-MN',
    name: 'James Godinez',
    email: 'godinezjames14@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 150'],
  },
  {
    id: 'student-maria',
    studentId: '2023-01928-MN',
    name: 'Maria Santos',
    email: 'maria.santos@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
  {
    id: 'student-carlos',
    studentId: '2023-04910-MN',
    name: 'Carlos Reyes',
    email: 'carlos.reyes@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
  {
    id: 'student-althea',
    studentId: '2023-09412-MN',
    name: 'Althea Cruz',
    email: 'althea.cruz@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 150'],
  },
  {
    id: 'student-david',
    studentId: '2023-05118-MN',
    name: 'David Tan',
    email: 'david.tan@watchers.edu.ph',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    enrolledSubjectCodes: ['CS 101', 'CS 102'],
  },
  ...tenNewStudents,
];

// Generate student submissions for quizzes across sections
export const generateSubmissionsForAssessment = (
  assessmentId: string,
  assessmentTitle: string,
  assessmentType: AssessmentType,
  subjectCode: string,
  maxScore: number
): StudentSubmission[] => {
  const enrolledStudents = allStudentProfiles.filter((s) =>
    s.enrolledSubjectCodes.includes(subjectCode)
  );

  return enrolledStudents.map((st, index) => {
    // Generate realistic distributed scores (between 80% and 100%)
    const scorePercentages = [0.95, 0.90, 0.85, 1.0, 0.92, 0.88, 0.96, 0.84, 0.91, 0.89, 0.94];
    const pct = scorePercentages[index % scorePercentages.length];
    const earned = Math.round(maxScore * pct);
    const isNeedsGrading = index === 3 && assessmentType === 'activity';

    return {
      id: `sub-${st.id}-${assessmentId}`,
      studentId: st.studentId,
      studentName: st.name,
      studentEmail: st.email,
      studentAvatar: st.avatar,
      subjectCode,
      assessmentId,
      assessmentTitle,
      assessmentType,
      submittedAt: `Oct 0${(index % 8) + 1}, 2026 - 10:${15 + index * 4} AM`,
      workText: `Submission for ${assessmentTitle} by ${st.name}. Key concept solutions analyzed and provided with formal steps.`,
      submissionExcerpt: `Submitted solution for ${assessmentTitle} demonstrating independent computational analysis.`,
      aiToolsDeclared: index % 2 === 0 ? ['Claude'] : ['None (Unassisted)'],
      aiDisclosureNote: index % 2 === 0 ? 'Brainstormed theoretical edge cases using Claude.' : 'Unassisted independent implementation.',
      followupQuizScore: earned,
      followupQuizMax: maxScore,
      focusLossCount: index % 3,
      scoreEarned: isNeedsGrading ? null : earned,
      maxScore,
      status: isNeedsGrading ? 'needs_grading' : 'graded',
      teacherFeedback: `Demonstrated solid grasp of core principles for ${assessmentTitle}.`,
    };
  });
};
