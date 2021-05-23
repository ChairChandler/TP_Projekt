import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SpeakersModule } from './speakers/speakers.module';

@Module({
  imports: [UsersModule, SpeakersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
