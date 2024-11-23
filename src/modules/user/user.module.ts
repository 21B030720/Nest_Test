import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BullService } from '../bull/bull.service';
import { EmailVerificationProcessor } from '../bull/bull.processor';
import { AppRedisModule } from 'src/modules/app-redis/app-redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AppRedisModule,
    BullModule.registerQueue({
      name: 'email-verification',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, BullService, EmailVerificationProcessor],
  exports: [UserService]
})
export class UserModule {}
