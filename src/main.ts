import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { getLogLevels } from './common/utils/helper.utils';
import helmet from 'helmet';
import { HeaderInjectorInterceptor } from './interceptors/inject-headers.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  app.use(helmet());
  app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix(process.env.APP_URL_PREFIX);
  app.useGlobalInterceptors(new HeaderInjectorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Motherhood One')
    .setDescription('The Motherhood One API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .addGlobalParameters({
      name: 'x-mh-timezone',
      in: 'header',
      description:
        'Timezone (Asia/Kolkata is not default. one must pass this header in every request)',
      required: true,
      schema: {
        type: 'string',
        default: 'Asia/Kolkata',
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.APP_PORT || 3005);
}
require('newrelic');
bootstrap();
