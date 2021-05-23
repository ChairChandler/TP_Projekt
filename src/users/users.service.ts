import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { SpeakerEntity } from 'src/speakers/entities/speaker.entity';
import { Repository } from 'typeorm';
import { Roles } from 'utils/roles';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_ENTITY') private users: Repository<UserEntity>, 
        @Inject('SPEAKER_ENTITY') private speakers: Repository<SpeakerEntity>) {}

    async getAll(): Promise<UserEntity[]> {
        return await this.users.find();
    }

    async findOne(name: string): Promise<UserEntity> {
        return await this.users.findOne(name);
    }

    create(name: string, password: string, role: Roles): string {
        return this.users.create({name, password, role}).name;
    }

    async remove(name: string): Promise<void> {
        await this.users.delete({name});
    }

    async setRole(name: string, role: Roles): Promise<void> {
        if(role == Roles.HEAD_ADMIN) {
            throw new ForbiddenException();
          }
      
        const user: UserEntity = await this.findOne(name);

        if(user.role == Roles.HEAD_ADMIN) {
            throw new ForbiddenException();
        }
      
        this.users.update(name, {role});
    }

    async setSpeaker(name: string, speaker: number): Promise<void> {
        const user_s: SpeakerEntity = await this.speakers.findOne(speaker);
        this.users.update(name, {speaker: user_s});
    }
}
