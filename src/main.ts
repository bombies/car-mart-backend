import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : [process.env.FIRST_ORIGIN, process.env.SECOND_ORIGIN],
    methods: ['POST', 'PUT', 'DELETE', 'GET']
  });
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
