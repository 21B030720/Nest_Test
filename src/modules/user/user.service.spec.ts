import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BullService } from '../bull/bull.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        BullService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should throw error if email already exists', async () => {
    const existingUser = new User();
    existingUser.email = 'test@test.com';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

    await expect(
      service.createUser({ name: 'John', email: 'test@test.com', password: 'password123' })
    ).rejects.toThrowError('ERR_USER_EMAIL_EXISTS');
  });
});
