import { Module } from '@nestjs/common';
import { VoicesService } from './voices.service';
import { VoicesController } from './voices.controller';
import { Database } from 'utils/db_conn';
import { VoiceEntity } from './entities/voice.entity';
import { UsersService } from '../users.service';

@Module({
  controllers: [VoicesController],
  providers: [
    VoicesService,
    UsersService,
    {
      provide: 'VOICE_ENTITY',
      async useFactory() {
          const db = await Database.singleton.conn;
          return db.getRepository(VoiceEntity);
      }
  },
  ]
})
export class VoicesModule {}
