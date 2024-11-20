import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'The list of users', type: [User] })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers(); // Fetch and return all users
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' }) // Add endpoint description
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User, // Define the response schema using the User entity
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists.',
  })
  @ApiBody({
    description: 'Details of the user to be created',
    type: CreateUserDto, // Define the request body schema using CreateUserDto
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return user; // This response will match the 'type' in ApiResponse
    } catch (error) {
      if (error.message === 'ERR_USER_EMAIL_EXISTS') {
        throw new Error('ERR_USER_EMAIL_EXISTS');
      }
      throw error;
    }
  }
}
