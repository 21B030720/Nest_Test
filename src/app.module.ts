import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { User } from './modules/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config'; // For environment variables
import { UserModule } from './modules/user/user.module';
import { AppRedisService } from './modules/app-redis/app-redis.service';
import { AppRedisModule } from './modules/app-redis/app-redis.module';
import { ProxyModule } from './modules/proxy/proxy.module';


@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
    }),
    BullModule.registerQueue({
      name: 'email-verification', // Queue name
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    UserModule,
    BullModule,
    AppRedisModule,
    ProxyModule
  ],
  providers: [AppRedisService],
  
})
export class AppModule {}
