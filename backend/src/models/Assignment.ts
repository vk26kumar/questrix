import mongoose, { Document, Schema } from 'mongoose';
import { IAssignment, QuestionTypeConfig } from '../types';

export interface IAssignmentDocument extends Omit<IAssignment, '_id'>, Document {}

const QuestionTypeConfigSchema = new Schema<QuestionTypeConfig>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'Multiple Choice Questions',
        'Short Questions',
        'Long Questions',
        'Diagram/Graph-Based Questions',
        'Numerical Problems',
        'True/False',
        'Fill in the Blanks',
      ],
    },
    numberOfQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    marksPerQuestion: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    schoolName: {
      type: String,
      required: true,
      trim: true,
      default: 'Delhi Public School, Sector-4, Bokaro',
    },
    dueDate: {
      type: String,
      required: true,
    },
    timeAllowed: {
      type: String,
      required: true,
      default: '45 minutes',
    },
    questionTypes: {
      type: [QuestionTypeConfigSchema],
      required: true,
      validate: {
        validator: (v: QuestionTypeConfig[]) => v.length > 0,
        message: 'At least one question type is required',
      },
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    additionalInstructions: {
      type: String,
      trim: true,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
 {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Assignment = mongoose.model<IAssignmentDocument>(
  'Assignment',
  AssignmentSchema
);

export default Assignment;