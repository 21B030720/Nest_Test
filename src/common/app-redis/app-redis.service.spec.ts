import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/modules/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { AppRedisService } from 'src/common/app-redis/app-redis.service';
import { BullService } from 'src/modules/bull/bull.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User), // Mock the User repository
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AppRedisService, // Mock Redis service
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: BullService, // Mock Bull service
          useValue: {
            addEmailVerificationJob: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
