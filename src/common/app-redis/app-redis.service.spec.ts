import { Test, TestingModule } from '@nestjs/testing';
import { AppRedisService } from './app-redis.service';

describe('AppRedisService', () => {
  let service: AppRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppRedisService],
    }).compile();

    service = module.get<AppRedisService>(AppRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
