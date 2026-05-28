import dotenv from 'dotenv';
dotenv.config();
import IORedis from 'ioredis';

let redis: IORedis;

const connectRedis = (): IORedis => {
  if (redis) return redis;

  const redisURL = process.env.REDIS_URL;

  if (!redisURL) {
    throw new Error('REDIS_URL is not defined in environment variables');
  }

  redis = new IORedis(redisURL, {
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,    // Required for BullMQ
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.error('❌ Redis connection failed after 3 retries');
        return null;
      }
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
  });

  redis.on('connect', () => {
    console.log('✅ Redis Connected');
  });

  redis.on('error', (err) => {
    console.error(`❌ Redis error: ${err}`);
  });

  redis.on('reconnecting', () => {
    console.warn('⚠️  Redis reconnecting...');
  });

  return redis;
};

// Separate connection for BullMQ (requires maxRetriesPerRequest: null)
export const getBullMQConnection = (): IORedis => {
  const redisURL = process.env.REDIS_URL;

  if (!redisURL) {
    throw new Error('REDIS_URL is not defined in environment variables');
  }

  return new IORedis(redisURL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

export default connectRedis;