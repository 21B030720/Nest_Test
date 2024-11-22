import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BullService } from '../bull/bull.service';
import { AppRedisService } from 'src/common/app-redis/app-redis.service';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bullService: BullService,  // To manage background jobs
    private redisService: AppRedisService,
  ) {}

  // Check if the email already exists
  async isEmailUnique(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    return !existingUser;
  }

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Check if the email already exists
    const isUnique = await this.isEmailUnique(email);
    if (!isUnique) {
      throw new HttpException('ERR_USER_EMAIL_EXISTS', 400)
    }

    // Create a new user with default status = false
    const user = this.userRepository.create(createUserDto);
    user.status = false; // Default status

    // Save the user to the database
    await this.userRepository.save(user);

    // Schedule a job to update the user's status after 10 seconds
    await this.bullService.addEmailVerificationJob(user.id);

    return user;
  }

  async updateUserStatus(userId: number, status: boolean): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },  // Pass the userId as part of the `where` object
    });
    if (user) {
      user.status = status;
      await this.userRepository.save(user);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find(); // Fetch all users from the database
  }

  async getAllUsersFromRedis(): Promise<User[]> {
    const users = await this.redisService.getAllUsers();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    } as User))
  }

  async findUserById(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getUserById(id: number): Promise<User> {
    // Check if the user exists in the cache first
    const cachedUser = await this.redisService.get(`user:${id}`);
    if (cachedUser) {
      console.log("User exists in Redis");
      return JSON.parse(cachedUser); // Return user data from cache
    }

    // If user is not in cache, query the database
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'ERR_USER_NOT_FOUND',
      });
    }

    // Store the user data in Redis cache for 30 minutes
    await this.redisService.set(
      `user:${id}`,
      JSON.stringify(user),
      1800, // Cache expiration time in seconds (30 minutes)
    );

    return user;
  }

}
