import { forwardRef, Module } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { SpeakersController } from './speakers.controller';
import { UsersModule } from 'src/users/users.module';
import { Database } from 'utils/db_conn';
import { SpeakerEntity } from './entities/speaker.entity';

@Module({
  imports: [forwardRef(() => UsersModule)],
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
