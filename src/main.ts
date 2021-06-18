import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import * as hbs_helper from 'handlebars-helper-equal';
import { TokensService } from './users/tokens/tokens.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  hbs.registerHelper("equal", hbs_helper);
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true,
    transform: true,
  }));
  app.use(cookieParser());
  await app.listen(3000);

  const service = app.get(TokensService);
  service.cancelInvalidTokens();
}

bootstrap();