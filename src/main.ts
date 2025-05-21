import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createLoggerOption } from './common/utils/logger.utils';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { EEnvConfig } from './common/constants';
import { RequestExceptionsFilter } from './common/exceptions/requestExceptions.filter';
import { SocketIoAdapter } from './common/adapters/socketIo.adapter';
import { AsyncLocalStorage } from 'async_hooks';
import { RequestInterceptor } from './interceptor/requestInterceptor.filter';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

export const NAME_JOB = 'Chat Service';

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createLoggerOption(NAME_JOB)),
  });

  // get config
  const configService = app.get(ConfigService);
  Object.values(EEnvConfig).forEach((key) =>
    Logger.log(`${key} = ${configService.get(key)}`),
  );

  // webSocket with redisIoAdapter
  const socketIoAdapter = new SocketIoAdapter(app, configService);
  await socketIoAdapter.connectToRedis();
  app.useWebSocketAdapter(socketIoAdapter);

  // set global prefix
  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);

  // use global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // use global filters
  app.useGlobalFilters(new RequestExceptionsFilter());

  // use global interceptors
  app.useGlobalInterceptors(new RequestInterceptor(app.get(AsyncLocalStorage)));

  // enable cors
  app.enableCors({
    origin: '*',
  });

  // get port
  const port = configService.get(EEnvConfig.API_PORT) || 3000;

  //swagger
  const config = new DocumentBuilder()
    .setTitle('CHAT SERVICE')
    .setDescription('Chat Service API')
    .setVersion('1.0')
    .addTag('CHAT SERVICE')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'bearer')
    .addServer(`http://localhost:${port}`, 'LOCAL')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // listen
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
