import { Module } from '@nestjs/common';
import { AppRedisService } from './app-redis.service';

@Module({
    providers: [AppRedisService],
    exports: [AppRedisService], // Make sure it's exported
})
export class AppRedisModule {}
