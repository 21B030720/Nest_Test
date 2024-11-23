import axios from 'axios';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { Injectable } from '@nestjs/common';
import { proxyConfig } from './configs/proxy.config';

@Injectable()
export class ProxyService {
    private agent = HttpsProxyAgent({
        host: proxyConfig.host,
        port: proxyConfig.port,
        auth: `${proxyConfig.username}:${proxyConfig.password}`,
    });

    async makeRequest(url: string): Promise<any> {
        try {
          const response = await axios.get(url, {
            httpsAgent: this.agent,
          });
          return response.data;
        } catch (error) {
          console.error('Error making proxy request:', error.message);
          throw error;
        }
    }

}
