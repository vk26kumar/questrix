import { Request, Response } from 'express';
import { z } from 'zod';
import Assignment from '../models/Assignment';
import Result from '../models/Result';
import { addGenerationJob } from '../queues/queue';
import connectRedis from '../config/redis';
import { ApiResponse, IAssignment } from '../types';

//Validation Schema

const QuestionTypeConfigSchema = z.object({
  type: z.enum([
    'Multiple Choice Questions',
    'Short Questions',
    'Long Questions',
    'Diagram/Graph-Based Questions',
    'Numerical Problems',
    'True/False',
    'Fill in the Blanks',
  ]),
  numberOfQuestions: z.number().min(1),
  marksPerQuestion: z.number().min(1),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  className: z.string().min(1, 'Class is required'),
  schoolName: z.string().default('Delhi Public School, Sector-4, Bokaro'),
  dueDate: z.string().min(1, 'Due date is required'),
  timeAllowed: z.string().default('45 minutes'),
  questionTypes: z
    .array(QuestionTypeConfigSchema)
    .min(1, 'At least one question type is required'),
  totalQuestions: z.number().min(1),
  totalMarks: z.number().min(1),
  additionalInstructions: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

//Controllers
export const createAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validationResult = CreateAssignmentSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validationResult.error.errors
          .map((e) => e.message)
          .join(', '),
      } as ApiResponse<null>);
      return;
    }

    const data = validationResult.data;
    const assignment = await Assignment.create({
      ...data,
      status: 'pending',
    });

    const assignmentId = assignment._id.toString();
    await addGenerationJob({
      assignmentId,
      assignment: {
        ...data,
        _id: assignmentId,
        status: 'pending',
      } as IAssignment,
    });

    res.status(201).json({
      success: true,
      data: {
        assignmentId,
        message: 'Assignment created and queued for generation',
      },
    } as ApiResponse<{ assignmentId: string; message: string }>);

  } catch (error) {
    console.error('❌ Create assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
};

export const getAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const redis = connectRedis();
    const cacheKey = 'assignments:all';
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.status(200).json({
        success: true,
        data: JSON.parse(cached),
      });
      return;
    }

    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .lean();
    await redis.setex(cacheKey, 60, JSON.stringify(assignments));

    res.status(200).json({
      success: true,
      data: assignments,
    } as ApiResponse<typeof assignments>);

  } catch (error) {
    console.error('❌ Get assignments error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
};

export const getAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const redis = connectRedis();
    const cacheKey = `assignment:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.status(200).json({
        success: true,
        data: JSON.parse(cached),
      });
      return;
    }

    const assignment = await Assignment.findById(id).lean();

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      } as ApiResponse<null>);
      return;
    }

    await redis.setex(cacheKey, 300, JSON.stringify(assignment));

    res.status(200).json({
      success: true,
      data: assignment,
    } as ApiResponse<typeof assignment>);

  } catch (error) {
    console.error('❌ Get assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
};

// GET /api/assignments/:id/result — Get result for assignment
export const getAssignmentResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const redis = connectRedis();
    const cacheKey = `result:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.status(200).json({
        success: true,
        data: JSON.parse(cached),
      });
      return;
    }

    const result = await Result.findOne({ assignmentId: id }).lean();

    if (!result) {
      res.status(404).json({
        success: false,
        error: 'Result not found',
      } as ApiResponse<null>);
      return;
    }

    // Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(result));

    res.status(200).json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);

  } catch (error) {
    console.error('❌ Get result error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
};

// DELETE /api/assignments/:id — Delete assignment
export const deleteAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const redis = connectRedis();

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      } as ApiResponse<null>);
      return;
    }

    await Result.findOneAndDelete({ assignmentId: id });
    await redis.del(`assignment:${id}`);
    await redis.del(`result:${id}`);
    await redis.del('assignments:all');

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    } as ApiResponse<null>);

  } catch (error) {
    console.error('❌ Delete assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
};

// POST /api/assignments/:id/regenerate — Regenerate question paper
export const regenerateAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const redis = connectRedis();

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      } as ApiResponse<null>);
      return;
    }

    await Result.findOneAndDelete({ assignmentId: id });
    await redis.del(`result:${id}`);
    await redis.del(`assignment:${id}`);
    await redis.del('assignments:all');

    await Assignment.findByIdAndUpdate(id, { status: 'pending' });
    await addGenerationJob({
      assignmentId: id,
      assignment: assignment.toObject() as unknown as IAssignment,
    });

    res.status(200).json({
      success: true,
      data: {
        assignmentId: id,
        message: 'Regeneration started',
      },
    } as ApiResponse<{ assignmentId: string; message: string }>);

  } catch (error) {
    console.error('❌ Regenerate error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
};