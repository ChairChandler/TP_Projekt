import { ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { Roles } from 'utils/roles';

@Injectable()
export class TokensService {
  constructor(
    @Inject('USER_ENTITY') private users: Repository<UserEntity>, 
    @Inject('TOKEN_ENTITY') private tokens: Repository<TokenEntity>) {}
  
  async signIn(name: string, password: string): Promise<{token: string, role: Roles}> {
    const user = await this.users.findOne({name, password});
    if(user) {
      const token = crypto.randomBytes(32).toString();
      const created_entity = this.tokens.create({user, token});
      if(created_entity) {
        return {token, role: user.role};
      }

      console.error('Database token problem');
      throw new InternalServerErrorException();
    }

    console.error('Wrong auth informations');
    throw new ForbiddenException();
  }

  async isLogged(token: string): Promise<boolean> {
    const entity = await this.tokens.findOne({token});
    return entity ? true : false;
  }
}
