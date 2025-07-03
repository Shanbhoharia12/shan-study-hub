export interface SemesterWithCounts {
  id: number;
  number: number;
  name: string;
  description?: string | null;
  subjectCount?: number | null;
}

export interface SubjectWithCounts {
  id: number;
  name: string;
  code: string;
  semesterId: number;
  description?: string | null;
  notesCount: number;
  practicalsCount: number;
  assignmentsCount: number;
}

export interface ExamYear {
  year: number;
  paperCount: number;
}

export type MaterialType = "notes" | "practical" | "assignment";
export type ExamType = "internal" | "university";
