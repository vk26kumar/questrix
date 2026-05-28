//Question Types
export type QuestionType =
  | 'Multiple Choice Questions'
  | 'Short Questions'
  | 'Long Questions'
  | 'Diagram/Graph-Based Questions'
  | 'Numerical Problems'
  | 'True/False'
  | 'Fill in the Blanks';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging';

export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

//Assignment Types

export interface QuestionTypeConfig {
  id: string;
  type: QuestionType;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  timeAllowed: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  fileUrl?: string;
  fileName?: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
}

//Form Types
export interface AssignmentFormData {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  timeAllowed: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions: string;
  file?: File | null;
}

//Question Paper Types
export interface Question {
  questionNumber: number;
  text: string;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
}

export interface Section {
  sectionLabel: string;
  title: string;
  instruction: string;
  questionType: QuestionType;
  questions: Question[];
}

export interface AnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface QuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstruction: string;
  sections: Section[];
  answerKey: AnswerKeyItem[];
}

export interface AssignmentResult {
  _id: string;
  assignmentId: string;
  questionPaper: QuestionPaper;
  createdAt: string;
}

//Redux State Types
export interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  isLoading: boolean;
  error: string | null;
}

export interface ResultState {
  currentResult: AssignmentResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  isGenerating: boolean;
  generationProgress: number;
  generationMessage: string;
  currentStep: number;
  sidebarOpen: boolean;
}

//API Response Type

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

//WebSocket Event Types
export interface JobProgressEvent {
  assignmentId: string;
  status: string;
  progress: number;
  message: string;
}

export interface JobCompleteEvent {
  assignmentId: string;
  resultId: string;
  status: 'completed';
}

export interface JobFailedEvent {
  assignmentId: string;
  status: 'failed';
  error: string;
}

//Available Question Types
export const QUESTION_TYPES: QuestionType[] = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks',
];

//Difficulty Colors
export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  Easy: 'bg-green-100 text-green-700 border-green-200',
  Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Challenging: 'bg-red-100 text-red-700 border-red-200',
};