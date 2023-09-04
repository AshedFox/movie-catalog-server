import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const config = app.get(ConfigService);

  if (config.get<string>('NODE_ENV') === 'production') {
    app.use(helmet());
  }
  app.enableCors({
    credentials: true,
    origin: config.get<string>('CLIENT_URL'),
  });
  app.use(cookieParser(config.get('COOKIE_SECRET')));
  app.use(graphqlUploadExpress());

  await app.listen(config.get('PORT') || 3000);
  Logger.debug(`Listening at ${await app.getUrl()}`, 'bootstrap');
}
bootstrap();
