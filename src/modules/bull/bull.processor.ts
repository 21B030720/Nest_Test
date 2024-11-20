import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';  // Make sure to import the UserService

@Processor('email-verification')
@Injectable()
export class EmailVerificationProcessor {
  constructor(private readonly userService: UserService) {}

  @Process('verify-email')
  async handleEmailVerificationJob(job: Job) {
    const { userId } = job.data;
    console.log(`Verifying email for user with ID: ${userId}`);

    try {
      // You can update the user's status here
      const user = await this.userService.findUserById(userId);
      console.log(`Found user: ${user ? user.id : 'Not found'}`);

      if (user) {
        // Update the user's status to true after verification
        await this.userService.updateUserStatus(userId, true);
        console.log(`User with ID: ${userId} status updated.`);
      } else {
        console.log(`User with ID: ${userId} not found.`);
      }
    } catch (error) {
      console.error('Error processing email verification job:', error);
    }
  }
}
