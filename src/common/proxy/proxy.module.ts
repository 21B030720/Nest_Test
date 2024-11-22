import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

@Module({
  providers: [ProxyService],
  exports: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
