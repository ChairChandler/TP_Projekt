import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from './users/tokens/tokens.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userToken = request.cookies['token'];
    if(await this.tokenService.isLogged(userToken)) {
      return true;
    } else {
      return false;
    }
  }
}