import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(graphqlUploadExpress());

  await app.listen(3000);
}
bootstrap();
