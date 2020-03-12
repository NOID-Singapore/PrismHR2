import { createHandyClient } from 'handy-redis';
import Logger from '../Logger';

const LOG = new Logger('redis.ts');

const { REDIS_HOST = 'localhost', REDIS_PORT = '6379' } = process.env;

const RedisClient = createHandyClient({
  host: REDIS_HOST,
  port: +REDIS_PORT
});

RedisClient.redis.on('connect', () => LOG.info('Redis is connected'));

export const getRedisKey = (uniqueIdentifier: string | number) => {
  return `${uniqueIdentifier}-authentication-set`;
};

export default RedisClient;
