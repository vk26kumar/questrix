import { Worker, Job } from 'bullmq';
import dotenv from 'dotenv';
import { getBullMQConnection } from '../config/redis';
import { generateQuestionPaper } from '../services/ai.service';
import { emitJobProgress, emitJobComplete, emitJobFailed } from '../socket/socket';
import { GenerationJobData } from '../types';
import connectDB from '../config/db';
import Assignment from '../models/Assignment';
import Result from '../models/Result';

dotenv.config();

const QUEUE_NAME = 'question-generation';

const processJob = async (job: Job<GenerationJobData>): Promise<void> => {
  const { assignmentId, assignment } = job.data;

  console.log(`Processing job: ${job.id} for assignment: ${assignmentId}`);

  try {
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'processing',
    });

    emitJobProgress({
      assignmentId,
      status: 'active',
      progress: 10,
      message: 'Starting AI generation...',
    });

    await job.updateProgress(10);

    emitJobProgress({
      assignmentId,
      status: 'active',
      progress: 30,
      message: 'Generating questions with AI...',
    });

    await job.updateProgress(30);

    const questionPaper = await generateQuestionPaper(assignment);

    emitJobProgress({
      assignmentId,
      status: 'active',
      progress: 70,
      message: 'Processing AI response...',
    });

    await job.updateProgress(70);
    const result = await Result.create({
      assignmentId,
      questionPaper,
    });

    emitJobProgress({
      assignmentId,
      status: 'active',
      progress: 90,
      message: 'Saving results...',
    });

    await job.updateProgress(90);
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
    });

    emitJobProgress({
      assignmentId,
      status: 'completed',
      progress: 100,
      message: 'Question paper ready!',
    });

    await job.updateProgress(100);
    emitJobComplete({
      assignmentId,
      resultId: result._id.toString(),
      status: 'completed',
    });

    console.log(`Job ${job.id} completed successfully`);

  } catch (error) {
    console.error(`❌ Job ${job.id} failed:`, error);
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'failed',
    });

    emitJobFailed({
      assignmentId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });

    throw error;
  }
};

const startWorker = async (): Promise<void> => {
  await connectDB();
  const worker = new Worker<GenerationJobData>(
    QUEUE_NAME,
    processJob,
    {
      connection: getBullMQConnection(),
      concurrency: 3,
    }
  );

  worker.on('completed', (job) => {
    console.log(`Worker completed job: ${job.id}`);
  });

  worker.on('failed', (job, error) => {
    console.error(`Worker failed job: ${job?.id}`, error);
  });

  worker.on('active', (job) => {
    console.log(`Worker processing job: ${job.id}`);
  });

  console.log('BullMQ Worker started and listening for jobs...');
};

startWorker().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});

export default startWorker;