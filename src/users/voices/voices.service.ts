import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fs_old from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { VoiceEntity } from './entities/voice.entity';
import { Stream } from 'stream';
import { SpeakerEntity } from 'src/speakers/entities/speaker.entity';

@Injectable()
export class VoicesService {
  constructor(
    private usersService: UsersService,
    @Inject('SPEAKER_ENTITY') private speakers: Repository<SpeakerEntity>,
    @Inject('VOICE_ENTITY') private voices: Repository<VoiceEntity>) {}

  async create(name: string, file: Express.Multer.File): Promise<number> {
    const data_path = path.join('data', 'voices', name);

    // create user voice directory if not exists
    await this.createDirectory(data_path);
    const fpath = path.join(data_path, this.generateUniqueFilename());
    await fs.writeFile(fpath, file.buffer);
    
    const owner_entity = await this.usersService.findOne(name, {relations: true});
    
    const new_entity = this.voices.create({
      path: fpath, 
      owner: owner_entity, 
    });

    await this.voices.insert(new_entity);
    await this.usersService.appendVoice(name, new_entity);

    return new_entity.id;
  }

  private async createDirectory(path: string): Promise<void> {
    try {
      await fs.lstat(path);
    } catch(e) {
      await fs.mkdir(path)
    }
  }

  private generateUniqueFilename(): string {
    const base_name = Date.now().toString();
    const index = Math.round(Math.random()* Number.MAX_VALUE);

    return `${base_name}_${index}`;
  }

  async findAll(name: string): Promise<VoiceEntity[]> {
    const owner_entity = await this.usersService.findOne(name, {relations: true});
    return owner_entity.voices;
  }

  async loadFile(vid: number): Promise<Stream> {
    const voice_entity = await this.findOne(vid);
    return fs_old.createReadStream(voice_entity.path);
  }

  async findOne(vid: number): Promise<VoiceEntity> {
    return this.voices.findOne(vid);
  }

  async remove(vid: number): Promise<void> {
    await this.voices.delete({id: vid});
  }
}
