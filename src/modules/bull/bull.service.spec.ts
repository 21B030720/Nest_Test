import { Test, TestingModule } from '@nestjs/testing';
import { BullService } from './bull.service';
import { getQueueToken } from '@nestjs/bull';

describe('BullService', () => {
  let service: BullService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullService,
        {
          provide: getQueueToken('email-verification'), // Mock the queue
          useValue: {
            add: jest.fn(), // Mock add method
          },
        },
      ],
    }).compile();

    service = module.get<BullService>(BullService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
