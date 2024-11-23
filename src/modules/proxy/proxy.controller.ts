import { Controller, Get } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('test')
  async testProxyRequest() {
    const url = 'https://dog.ceo/api/breeds/image/random'; 
    try {
      const response = await this.proxyService.makeRequest(url);
      return {
        statusCode: 200,
        message: 'Request successful via proxy',
        data: response,
      };
    } catch (error) {
      return {
        statusCode: error.status,
        error: error.message,
      };
    }
  }
}
