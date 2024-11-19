import { Module } from '@nestjs/common';
import { BullModule as NestBullModule } from '@nestjs/bull';
import { UserService } from '../user/user.service';
import { BullService } from './bull.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    NestBullModule.registerQueue({
      name: 'email-verification',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [BullService, UserService],
  exports: [BullService],
})
export class BullModule {}
