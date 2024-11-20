import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BullService } from '../bull/bull.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bullService: BullService,  // To manage background jobs
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('ERR_USER_EMAIL_EXISTS');
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

  async findUserById(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

}
