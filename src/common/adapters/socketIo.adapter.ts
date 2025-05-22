import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import { EEnvConfig } from 'src/common/constants';

/**
 * @class SocketIoAdapter
 * @description This is a class for the socket io adapter
 */
export class SocketIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(
    private readonly appOrHttpServer: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(appOrHttpServer);
  }

  /**
   * @method connectToRedis
   * @description This is a method for the socket io adapter to connect to redis
   */
  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${this.configService.get(EEnvConfig.REDIS_USERNAME)}:${this.configService.get(EEnvConfig.REDIS_PASSWORD)}@${this.configService.get(EEnvConfig.REDIS_HOST)}:${this.configService.get(EEnvConfig.REDIS_PORT)}`,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    pubClient.on('error', (err) => {
      Logger.log(err.message, 'pubClient');
    });

    subClient.on('error', (err) => {
      Logger.log(err.message, 'subClient');
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  /**
   * @method createIOServer
   * @description This is a method for the socket io adapter to create a server
   */
  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, { ...options });
    server.adapter(this.adapterConstructor);

    return server;
  }
}
