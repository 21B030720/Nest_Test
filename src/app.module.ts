import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { User } from './modules/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config'; // For environment variables
import { UserModule } from './modules/user/user.module';
import { AppRedisService } from './common/app-redis/app-redis.service';
import { AppRedisModule } from './common/app-redis/app-redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,       // Should now be 'localhost'
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME, // 'myuser'
      password: process.env.DB_PASSWORD, // 'mypassword'
      database: process.env.DB_NAME,     // 'mydatabase'
      entities: [User], // Entities for PostgreSQL
      synchronize: false, // Set to false in production to avoid data loss
    }),
    BullModule.registerQueue({
      name: 'email-verification', // Queue name
      redis: {
        host: process.env.REDIS_HOST || 'localhost', // Redis host (default: localhost)
        port: parseInt(process.env.REDIS_PORT, 10) || 6379, // Redis port (default: 6379)
      },
    }),
    UserModule,
    BullModule,
    AppRedisModule
  ],
  providers: [AppRedisService],
})
export class AppModule {}
