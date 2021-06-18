import { forwardRef, Module } from '@nestjs/common';
import { VoicesService } from './voices.service';
import { VoicesController } from './voices.controller';
import { Database } from 'utils/db_conn';
import { VoiceEntity } from './entities/voice.entity';
import { UsersModule } from '../users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  // circular dependencies fix
  imports: [
    forwardRef(() => UsersModule), 
    forwardRef(() => TokensModule)
  ],
  controllers: [VoicesController],
  providers: [
    VoicesService,
    {
      provide: 'VOICE_ENTITY',
      async useFactory() {
          const db = await Database.singleton.conn;
          return db.getRepository(VoiceEntity);
      }
    }
  ],
  exports: [
    VoicesService,
    'VOICE_ENTITY'
  ]
})
export class VoicesModule {}
