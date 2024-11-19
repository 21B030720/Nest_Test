import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BullService } from '../bull/bull.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectQueue('email-verification') private readonly emailVerificationQueue: Queue,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;

    // Проверка на существующий email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('ERR_USER_EMAIL_EXISTS');
    }

    const user = this.userRepository.create({
      name,
      email,
      password,
      status: false, // Статус по умолчанию false
    });

    await this.userRepository.save(user);

    // Помещаем задачу в очередь Bull для установки статуса в true через 10 секунд
    this.emailVerificationQueue.add(
      'verify-email',
      { userId: user.id },
      { delay: 10000 }, // Задержка 10 секунд
    );

    return user;
  }

  // Добавляем метод поиска пользователя по ID
  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUserStatus(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
