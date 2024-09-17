import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { getLogLevels } from './common/utils/helper.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Motherhood One')
    .setDescription('Motherhood One API Documentation')
    .setVersion('1.0')
    .addTag('mh1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.APP_PORT || 3005);
}
bootstrap();
