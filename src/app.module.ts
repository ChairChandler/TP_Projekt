import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TokensModule } from './users/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  controllers: [AppController]
})
export class AppModule {}
