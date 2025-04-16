import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3002'], // 允许的源
    credentials: true, // 如果需要支持凭证，则设为true
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
