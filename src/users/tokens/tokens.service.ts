import { ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { Roles } from 'utils/roles';
import * as schedule from 'node-schedule';

@Injectable()
export class TokensService {
  private tasks: Map<string, schedule.Job> = new Map();

  constructor(
    @Inject('USER_ENTITY') private users: Repository<UserEntity>, 
    @Inject('TOKEN_ENTITY') private tokens: Repository<TokenEntity>) {}
  
  async signIn(name: string, password: string): Promise<{token: string, role: Roles}> {
    const user = await this.users.findOne({name, password});

    if(user) {
      const token = crypto.randomBytes(32).toString();
      const created_entity = this.tokens.create({user, token});
      
      try {
        await this.tokens.save(created_entity);
        return {token, role: user.role};
      } catch(e) {
        throw new InternalServerErrorException('User already logged');
      }
    }

    throw new ForbiddenException('Wrong auth informations');
  }

  async signOut(token: string): Promise<void> {
    try {
      var entity = await this.tokens.findOne({token});
    } catch(e) {
      throw new InternalServerErrorException('User has been unlogged earlier');
    }

    await this.tokens.remove(entity);
  }

  async isLogged(token: string): Promise<boolean> {
    const entity = await this.tokens.findOne({token});
    return entity ? true : false;
  }

  createSignOutTask(expires: Date, token: string) {
    const job = schedule.scheduleJob(expires, () => {
      this.signOut(token);
    });

    this.tasks.set(token, job);
  }

  cancelSignOutTask(token: string) {
    this.tasks.delete(token);
  }
}
