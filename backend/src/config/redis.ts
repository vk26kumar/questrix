import dotenv from 'dotenv';
dotenv.config();
import IORedis from 'ioredis';

let redis: IORedis;

const connectRedis = (): IORedis => {
  if (redis) return redis;

  const redisURL = process.env.REDIS_URL;
  if (!redisURL) throw new Error('REDIS_URL is not defined');

  redis = new IORedis(redisURL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times: number) => {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });

  redis.on('connect', () => console.log('✅ Redis Connected'));
  redis.on('error', (err) => console.error(`❌ Redis error: ${err}`));
  redis.on('reconnecting', () => console.warn('⚠️  Redis reconnecting...'));

  return redis;
};

// Return plain options instead of IORedis instance — avoids bullmq ioredis version conflict
export const getBullMQConnection = () => {
  const redisURL = process.env.REDIS_URL;
  if (!redisURL) throw new Error('REDIS_URL is not defined');

  const url = new URL(redisURL);
  return {
    host: url.hostname,
    port: parseInt(url.port),
    password: url.password,
    username: url.username || 'default',
    tls: redisURL.startsWith('rediss://') ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
};

export default connectRedis;