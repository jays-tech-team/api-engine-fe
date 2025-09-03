import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from './utils/logger/app.logger';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new AppLogger('Bootstrap');
  
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: process.env.NODE_ENV === 'development',
      }),
    );

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // CORS configuration
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global interceptor for response transformation
    app.useGlobalInterceptors(new TransformInterceptor());

    const port = process.env.PORT || 3003;
    await app.listen(port, '0.0.0.0');
    
    logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
    logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
