import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private appService: AppService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const userToken = request.cookies['token'];
    if(this.appService.isLogged(userToken)) {
      return true;
    } else {
      request.res.status(HttpStatus.UNAUTHORIZED).location('/').send();
      return false;
    }
  }
}