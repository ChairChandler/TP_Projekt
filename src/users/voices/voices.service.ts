import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fs_old from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { VoiceEntity } from './entities/voice.entity';
import { Stream } from 'stream';

@Injectable()
export class VoicesService {
  constructor(
    private usersService: UsersService,
    @Inject('VOICE_ENTITY') private voices: Repository<VoiceEntity>) {}

  async create(name: string, file: Express.Multer.File): Promise<number> {
    const data_path = path.join('data', 'voices', name);

    // create user voice directory if not exists
    try {
      await fs.lstat(data_path);
    } catch(e) {
      await fs.mkdir(data_path)
    }

    const base_name = Date.now().toString();
    const index = Math.round(Math.random()* Number.MAX_VALUE);
    const owner_entity = await this.usersService.findOne(name);

    
    const fpath = path.join(data_path, `${base_name}_${index}`);
    await fs.writeFile(fpath, file.buffer);

    return this.voices.create({
      path: fpath, 
      owner: owner_entity, 
      speaker: owner_entity.speaker
    }).id;
  }

  async findAll(name: string): Promise<VoiceEntity[]> {
    const owner_entity = await this.usersService.findOne(name);
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
