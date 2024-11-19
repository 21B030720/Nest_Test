import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UserService } from './modules/user/user.service';
import { User } from './modules/user/entities/user.entity';
import { BullService } from './modules/bull/bull.service';
import { Queue } from 'bull';
import { ConfigModule } from '@nestjs/config'; // For environment variables

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
      synchronize: true, // Set to false in production to avoid data loss
    }),

    BullModule.registerQueue({
      name: 'email-verification', // Queue name
      redis: {
        host: process.env.REDIS_HOST || 'localhost', // Redis host (default: localhost)
        port: parseInt(process.env.REDIS_PORT, 10) || 6379, // Redis port (default: 6379)
      },
    }),

  ],
  providers: [],
})
export class AppModule {}
