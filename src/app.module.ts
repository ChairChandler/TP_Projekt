import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { VoicesController } from './users/voices/voices.controller';
import { VoicesService } from './users/voices/voices.service';
import { UsersService } from './users/users.service';
import { VoicesModule } from './users/voices/voices.module';
import { UsersModule } from './users/users.module';
import { SpeakersModule } from './speakers/speakers.module';
import { VoicesModule } from './users/voices/voices.module';

@Module({
  imports: [VoicesModule, UsersModule, SpeakersModule],
  controllers: [AppController, UsersController, VoicesController],
  providers: [AppService, VoicesService, UsersService],
})
export class AppModule {}
