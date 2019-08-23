import RedisClient, { Redis } from "ioredis";

export const redis: Redis = new RedisClient();