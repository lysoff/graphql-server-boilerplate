import { v4 } from 'uuid';
import { Redis } from 'ioredis';

export const createConfirmLink = async (host: string, userId: string, redis: Redis) => {
  const id = v4();
  await redis.setex(userId, 60 * 60 * 24, id);

  return `${host}/confirm/${id}`;
};