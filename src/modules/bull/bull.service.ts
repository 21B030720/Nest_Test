import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Job } from 'bull';

@Injectable()
export class BullService {
  constructor(@InjectQueue('email-verification') private emailQueue: Queue) {}

  // Add job to update the user's status after 10 seconds
  async addEmailVerificationJob(userId: number): Promise<void> {
    await this.emailQueue.add(
      'verify-email',
      { userId },
      {
        delay: 10000, // Delay of 10 seconds
      },
    );
  }
}
