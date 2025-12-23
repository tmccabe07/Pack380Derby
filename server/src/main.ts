import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

   // Enable CORS
   app.enableCors({
    origin: 'http://localhost:3001', // Allow your Next.js frontend
    credentials: true, // Allow cookies/authorization headers if needed
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true},
  }));

  const config = new DocumentBuilder()
    .setTitle('Pinewood Derby API')
    .setDescription('Web Service for managing Pinewood Derby information.')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        description: 'Enter your API bearer token',
      },
      'bearer',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Server is running on: http://localhost:${port}/api`);
  logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
