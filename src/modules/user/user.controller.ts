import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all Users in Postgre
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'The list of users', type: [User] })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers(); // Fetch and return all users
  }

  // Get all Users in Redis Storage
  @Get('/redis') 
  @ApiOperation({ summary: 'Get all users from Redis' })
  @ApiResponse({ status: 200, description: 'The list of users', type: [User] })
  async getAllUsersFromRedis(): Promise<User[]> {
    return this.userService.getAllUsersFromRedis(); // Fetch and return all users
  }

  // Get User in Postgre or in Redis(30min storage)
  @Get('get-user-by-id')
  @ApiQuery({
    name: 'id',
    type: Number,
    description: 'User ID to fetch',
    example: 1,
  })
  // @ApiBody({})
  async getUserById(@Query() query: GetUserByIdDto) {
    const user = await this.userService.getUserById(query.id);
    return {
      statusCode: 200,
      message: 'SUCCESS',
      user,
    };
  }

  // Post(Create) User
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists.',
  })
  @ApiBody({
    description: 'Details of the user to be created',
    type: CreateUserDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return user;
    } catch (error) {
      if (error.message === 'ERR_USER_EMAIL_EXISTS') {
        throw new Error('ERR_USER_EMAIL_EXISTS');
      }
      throw error;
    }
  }
}
