import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  //app.use(helmet());
  app.use(cookieParser(config.get('COOKIE_SECRET')));
  app.use(graphqlUploadExpress());

  await app.listen(config.get('PORT') || 3000);
}
bootstrap();
