import dotenv from 'dotenv';
dotenv.config();
import { Queue, QueueEvents } from 'bullmq';
import { getBullMQConnection } from '../config/redis';
import { GenerationJobData } from '../types';

const QUEUE_NAME = 'question-generation';

// Create the queue
export const questionGenerationQueue = new Queue<GenerationJobData>(
  QUEUE_NAME,
  {
    connection: getBullMQConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: {
        count: 100,
        age: 24 * 3600, // 24 hours
      },
      removeOnFail: {
        count: 50,
        age: 24 * 3600,
      },
    },
  }
);

// Queue events for monitoring
export const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: getBullMQConnection(),
});

// Queue event listeners
queueEvents.on('completed', ({ jobId }) => {
  console.log(`✅ Job ${jobId} completed`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Job ${jobId} failed: ${failedReason}`);
});

queueEvents.on('progress', ({ jobId, data }) => {
  console.log(`📊 Job ${jobId} progress: ${data}`);
});

// Add job to queue
export const addGenerationJob = async (
  data: GenerationJobData
): Promise<string> => {
  const job = await questionGenerationQueue.add(
    'generate-questions',
    data,
    {
      jobId: data.assignmentId,
    }
  );
  console.log(`📥 Job added to queue: ${job.id}`);
  return job.id as string;
};

export default questionGenerationQueue;