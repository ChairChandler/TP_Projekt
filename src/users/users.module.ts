import { Module } from '@nestjs/common';
import { SpeakerEntity } from 'src/speakers/entities/speaker.entity';
import { Database } from 'utils/db_conn';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: 'USER_ENTITY',
            async useFactory() {
                const db = await Database.singleton.conn;
                return db.getRepository(UserEntity);
            }
        },
        {
            provide: 'SPEAKER_ENTITY',
            async useFactory() {
                const db = await Database.singleton.conn;
                return db.getRepository(SpeakerEntity);
            }
        }
    ]
})
export class UsersModule {}
