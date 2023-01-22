import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : [process.env.FIRST_ORIGIN, process.env.SECOND_ORIGIN],
    methods: ['POST', 'PUT', 'DELETE', 'GET']
  });
  app.use(helmet())
  await app.listen(3000);
}
bootstrap();
