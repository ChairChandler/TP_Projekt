import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SpeakerEntity } from 'src/speakers/entities/speaker.entity';
import { Repository } from 'typeorm';
import { Roles } from 'utils/roles';
import { UserEntity } from './entities/user.entity';
import { createHash } from 'crypto';

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

    async create(name: string, password: string, role: Roles): Promise<string> {
        try {
            const entity = this.users.create({name, password_hash: this.createHash(password), role});
            await this.users.insert(entity);
            return entity.name;
        } catch(e) {
            throw new BadRequestException('User exists');
        }
    }

    async remove(name: string): Promise<void> {
        const user: UserEntity = await this.findOne(name);
        if(user.role == Roles.HEAD_ADMIN) {
            throw new ForbiddenException('Delete HEAD_ADMIN user forbidden');
        }

        await this.users.delete({name});
    }

    async setRole(name: string, role: Roles): Promise<void> {
        const user: UserEntity = await this.findOne(name);

        if(user.role == Roles.HEAD_ADMIN) {
            throw new ForbiddenException('Change HEAD_ADMIN role forbidden');
        }
      
        await this.users.update(name, {role});
    }

    async setPassword(name: string, password: string): Promise<void> {
        await this.users.update(name, {password_hash: password});
    }

    async setSpeaker(name: string, speaker: number): Promise<void> {
        const user_s: SpeakerEntity = await this.speakers.findOne(speaker);
        await this.users.update(name, {speaker: user_s});
    }

    private createHash(txt: string) {
        return createHash('sha256').update(txt).digest('hex');
    }
}
