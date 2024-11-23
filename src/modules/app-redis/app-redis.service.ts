import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppRedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, duration: number) {
    return this.redis.set(key, value, "EX", duration);
  }

  async getAllUsers(): Promise<any[]> {
    const keys = await this.redis.keys('user:*');
    const pipeline = this.redis.pipeline();
    keys.forEach((key) => pipeline.get(key));
  
    const results = await pipeline.exec();
    return results
      .map(([_, data]) => (typeof data === 'string' ? JSON.parse(data) : null))
      // .filter((user) => user !== null);
  }
  
}
