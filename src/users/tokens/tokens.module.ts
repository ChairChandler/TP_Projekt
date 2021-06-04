import { Module } from '@nestjs/common';
import { Database } from 'utils/db_conn';
import { UsersModule } from '../users.module';
import { TokenEntity } from './entities/token.entity';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  imports: [UsersModule],
  controllers: [TokensController],
  providers: [
    TokensService,
    {
      provide: 'TOKEN_ENTITY',
      async useFactory() {
          const db = await Database.singleton.conn;
          return db.getRepository(TokenEntity);
      }
  },
  ],
  exports: [
      TokensService,
      'TOKEN_ENTITY',
  ]
})
export class TokensModule {}
