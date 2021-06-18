import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SpeakersModule } from './speakers/speakers.module';
import { TokensModule } from './users/tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { VoicesModule } from './users/voices/voices.module';

@Module({
  imports: [
    TokensModule, 
    UsersModule, 
    VoicesModule,
    SpeakersModule
  ],
  controllers: [AppController]
})
export class AppModule {}
