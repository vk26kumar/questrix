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

export interface QuestionTypeConfig {
  type: QuestionType;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface IAssignment {
  _id?: string;
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
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuestion {
  questionNumber: number;
  text: string;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
}

export interface ISection {
  sectionLabel: string;
  title: string;
  instruction: string; 
  questionType: QuestionType;
  questions: IQuestion[];
}

export interface IAnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface IQuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstruction: string;
  sections: ISection[];
  answerKey: IAnswerKeyItem[];
}

export interface IResult {
  _id?: string;
  assignmentId: string;
  questionPaper: IQuestionPaper;
  createdAt?: string;
}

export interface GenerationJobData {
  assignmentId: string;
  assignment: IAssignment;
}

export type JobStatus =
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface JobProgressEvent {
  assignmentId: string;
  status: JobStatus;
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