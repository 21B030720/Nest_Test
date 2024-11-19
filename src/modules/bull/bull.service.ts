import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from '../user/user.service';

@Injectable()
@Processor('email-verification')
export class BullService {
  constructor(private readonly userService: UserService) {}

  @Process('verify-email')
  async verifyEmail(job: Job) {
    const { userId } = job.data;
    const user = await this.userService.findOneById(userId);
    user.status = true;
    await this.userService.updateUserStatus(user);
  }
}
