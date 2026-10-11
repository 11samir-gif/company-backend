import Redis from 'ioredis';
import dotenv from "dotenv"
// 1. Create Redis connection instance
dotenv.config()
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  // process.env always return the values as a string
  port: Number(process.env.REDIS_PORT) || 6379,
});

// 2. Event listeners for status monitoring
redis.on('connect', () => {
  console.log(' Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error(' Redis Connection Error:', err.message);
});

export default redis;