import { forwardRef, Module } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { SpeakersController } from './speakers.controller';
import { UsersModule } from 'src/users/users.module';
import { Database } from 'utils/db_conn';
import { SpeakerEntity } from './entities/speaker.entity';
import { TokensModule } from 'src/users/tokens/tokens.module';
import { VoicesModule } from 'src/users/voices/voices.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TokensModule),
    forwardRef(() => VoicesModule)
  ],
  providers: [
    SpeakersService,
    {
      provide: 'SPEAKER_ENTITY',
      async useFactory() {
          const db = await Database.singleton.conn;
          return db.getRepository(SpeakerEntity);
      }
    }
  ],
  controllers: [SpeakersController],
  exports: [
    SpeakersService,
    'SPEAKER_ENTITY'
  ]
})
export class SpeakersModule {}
