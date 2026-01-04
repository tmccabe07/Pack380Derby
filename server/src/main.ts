import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Configure HTTPS options if SSL is enabled
  const useSSL = process.env.USE_SSL === 'true';
  const httpsOptions = useSSL ? {
    key: fs.readFileSync(path.join(__dirname, '../../derby.key')),
    cert: fs.readFileSync(path.join(__dirname, '../../derby.crt')),
  } : undefined;

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    ...(httpsOptions && { httpsOptions }),
  });

   // Enable CORS
   app.enableCors({
    origin: '*', // Allow your Next.js frontend
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
  const protocol = useSSL ? 'https' : 'http';
  logger.log(`🚀 Server is running on: ${protocol}://localhost:${port}/api`);
  logger.log(`📚 API Documentation available at: ${protocol}://localhost:${port}/api/docs`);
  if (useSSL) {
    logger.log(`🔒 SSL/HTTPS is enabled`);
  }
}
bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
