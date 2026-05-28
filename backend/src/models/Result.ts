import mongoose, { Document, Schema } from 'mongoose';
import { IResult, IQuestionPaper, ISection, IQuestion, IAnswerKeyItem } from '../types';

export interface IResultDocument extends Omit<IResult, '_id'>, Document {}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionNumber: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Moderate', 'Challenging'],
    },
    marks: { type: Number, required: true },
    options: { type: [String], default: undefined },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    sectionLabel: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questionType: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const AnswerKeySchema = new Schema<IAnswerKeyItem>(
  {
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const QuestionPaperSchema = new Schema<IQuestionPaper>(
  {
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maximumMarks: { type: Number, required: true },
    generalInstruction: { type: String, required: true },
    sections: { type: [SectionSchema], required: true },
    answerKey: { type: [AnswerKeySchema], required: true },
  },
  { _id: false }
);

const ResultSchema = new Schema<IResultDocument>(
  {
    assignmentId: {
      type: String,
      required: true,
      index: true,
    },
    questionPaper: {
      type: QuestionPaperSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Result = mongoose.model<IResultDocument>('Result', ResultSchema);

export default Result;