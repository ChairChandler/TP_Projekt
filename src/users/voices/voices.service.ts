import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { VoiceEntity } from './entities/voice.entity';

@Injectable()
export class VoicesService {
  constructor(
    private usersService: UsersService,
    @Inject('VOICE_ENTITY') private voices: Repository<VoiceEntity>) {}

  async create(name: string, files: Express.Multer.File[]) {
    const data_path = path.join('data', 'voices', name);

    // create user voice directory if not exists
    try {
      await fs.lstat(data_path);
    } catch(e) {
      await fs.mkdir(data_path)
    }

    const base_name = Date.now().toString();
    const owner_entity = await this.usersService.findOne(name);

    await Promise.all(files.map(async (file, index) => {
      const fpath = path.join(data_path, `${base_name}_${index}`);
      await fs.writeFile(fpath, file.buffer);
      this.voices.create({
        path: fpath, 
        owner: owner_entity, 
        speaker: owner_entity.speaker
      });
    }));
  }

  async findAll(name: string): Promise<VoiceEntity[]> {
    const owner_entity = await this.usersService.findOne(name);
    return owner_entity.voices;
  }

  async loadFiles() {
    
  }

  findOne(name: string, vid: string) {
    return `This action returns a #${id} voice`;
  }

  remove(name: string, vid: string) {
    return `This action removes a #${id} voice`;
  }
}
