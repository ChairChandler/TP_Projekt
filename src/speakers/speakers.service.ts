import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import { UsersService } from 'src/users/users.service';
import { VoiceEntity } from 'src/users/voices/entities/voice.entity';
import { VoicesService } from 'src/users/voices/voices.service';
import { Repository } from 'typeorm';
import { Subprocess } from 'utils/subprocess';
import { SpeakerEntity } from './entities/speaker.entity';
import * as temp from 'temp';
import * as fs from 'fs';

@Injectable()
export class SpeakersService {
    static readonly CREATE_MODEL_SCRIPT_PATH = path.resolve(path.join('python', 'create_model.py'));
    static readonly TEST_SPEAKER_SCRIPT_PATH = path.resolve(path.join('python', 'test_speaker.py'));


    constructor(
        private usersService: UsersService,
        private voiceService: VoicesService,
        @Inject('SPEAKER_ENTITY') private speaker: Repository<SpeakerEntity>) {}

    async createModel(owner: string): Promise<number> {
        /*
         *   due to not enough time for the project 
         *   I decided to set every person the same model
         *   but it can be changed without big troubles
        */
        const owners_entities = await this.usersService.getAll({relations: true});
        const all_voices = owners_entities.map(o => {
            // typeORM doesnt support nested relations
            for(const v of o.voices) {
                v.owner = o;
            }
            return o.voices;
        }).flat();
        // const owner_entity = await this.usersService.findOne(owner);
        
        const script = new Subprocess(SpeakersService.CREATE_MODEL_SCRIPT_PATH);
        script.run(); 
        this.sendPaths(script, all_voices);
        await script.waitForExit();
        const model_path: string = script.read();

        let new_id, new_entities;
        for(const o of owners_entities) {
            const old_record = await this.speaker.findOne({where: {owner: o}});

            // there is somewhere bug, so its recommended to temporary update db manually 
            if(old_record) {
                old_record.model_path = model_path;
                new_entities = await this.speaker.save(old_record);
            } else {
                new_entities = this.speaker.create({
                    model_path, 
                    owner: o
                });
                new_entities = await this.speaker.save(new_entities);
            }

            await this.usersService.setSpeaker(o.name, new_entities.id);
            

            if(o.name == owner) {
                new_id = new_entities.id;
            }
        }

        return new_id;
    }
    
    private sendPaths(script: Subprocess, voices: VoiceEntity[]): void {
        script.send(voices.length.toString());

        for(const voice of voices) {
            script.send(voice.path);
            script.send(voice.owner.name);
        }
    }

    async testSpeaker(sid: number, file: Express.Multer.File): Promise<{probability: Number}> {
        const speaker = await this.speaker.findOne(sid, {relations: ['owner']});
        
        const script = new Subprocess(SpeakersService.TEST_SPEAKER_SCRIPT_PATH);
        script.run();

        try {
            script.send(speaker.model_path);

            const data = await new Promise((resolve, reject) => {
                temp.open('voice', (err, info) => {
                    if (!err) {
                        fs.write(info.fd, file.buffer, async err => {
                            if(err) {
                                console.error(err);
                                reject(err);
                            } else {
                                script.send(info.path);
                                await script.waitForExit();
                                const person = script.read();
                                const probability = Number(script.read());
                                resolve({person, probability});
                            }
                        });     
                    } else {
                        reject(err);
                    }
                });
            })
            
            const {person, probability}: any = data;

            if(person == speaker.owner.name) {
                return {probability};
            } else {
                return {probability: 0};
            }
        } catch(e) {
            console.error(e);
            throw new InternalServerErrorException(e.message);
        }
    }

    async getSpeakers(): Promise<{sid: number, uid: string}[]> {
        const speakers = await this.speaker.find({relations: ['owner']});
        return speakers.map(s => ({sid: s.id, uid: s.owner.name}));
    }
}

