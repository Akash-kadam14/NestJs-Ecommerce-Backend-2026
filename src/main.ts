import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cookie parser middleware
  app.use(cookieParser());

  // global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,         // Strips out any properties not defined in the DTO
    forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
    transform: true,         // Automatically transforms payloads to match DTO object types
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
