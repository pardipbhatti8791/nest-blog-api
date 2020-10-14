import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // If true, It will remove the additional data from post request which is not in dto
    forbidNonWhitelisted: false, // if trye server will throw error with exact extra data in payload
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  const options = new DocumentBuilder()
    .setTitle('GPCODERS Blog')
    .setDescription('Blog api with user authentication')
    .setVersion('1.0')
    .addTag('gpcoders blog')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000);
}
bootstrap();
