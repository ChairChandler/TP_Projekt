import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import * as hbs_helper from 'handlebars-helper-equal';
import { TokensService } from './users/tokens/tokens.service';
import { UsersService } from './users/users.service';
import { Roles } from 'utils/roles';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  hbs.registerHelper("equal", hbs_helper);
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false,
    transform: true,
  }));
  app.use(cookieParser());
  await app.listen(3000);

  const service = app.get(TokensService);
  service.cancelInvalidTokens();
  create_main_user(app.get(UsersService));
}

async function create_main_user(service: UsersService) {
  const user = await service.findOne('HeadAdmin');
  if(!user) {
    service.create('HeadAdmin', 'HeadAdmin', Roles.HEAD_ADMIN);
  }
}

bootstrap();