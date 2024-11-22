import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should return true if email is unique', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    const result = await userService.isEmailUnique('test@example.com');
    expect(result).toBe(true);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  });

  it('should return false if email already exists', async () => {
    const mockUser = new User();
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await userService.isEmailUnique('test@example.com');
    expect(result).toBe(false);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  });
});
