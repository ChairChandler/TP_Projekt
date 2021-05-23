import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as ps from 'child_process';
import * as path from 'path';
import { UsersService } from 'src/users/users.service';
import { VoiceEntity } from 'src/users/voices/entities/voice.entity';
import { Repository } from 'typeorm';
import { SpeakerEntity } from './entities/speaker.entity';

@Injectable()
export class SpeakersService {
    static readonly CREATE_MODEL_SCRIPT = path.join('python', 'create_model.py');
    static readonly TEST_SPEAKER_SCRIPT = path.join('python', 'test_speaker.py');

    constructor(
        private usersService: UsersService,
        @Inject('SPEAKER_ENTITY') private speaker: Repository<SpeakerEntity>) {}

    async createModel(owner: string): Promise<number> {
        const owner_entity = await this.usersService.findOne(owner);

        const script = ps.spawn('python3', [SpeakersService.CREATE_MODEL_SCRIPT]);

        this.sendPaths(script, owner_entity.voices);
        await this.waitForExit(script);

        const model_path: string = script.stdout.read();
        const new_entity = this.speaker.create({
            model_path, 
            owner: owner_entity, 
            voices: owner_entity.voices
        });

        return new_entity.id;
    }
    
    private sendPaths(script: ps.ChildProcessWithoutNullStreams, voices: VoiceEntity[]): void {
        for(const voice of voices) {
            if(!script.stdin.write(voice.path)) {
                console.error('Transmission to subprocess error');
                throw new InternalServerErrorException();
            }
        }
    }

    private async waitForExit(script: ps.ChildProcessWithoutNullStreams): Promise<void> {
        const exit_code: number = await new Promise((resolve, reject) => {
            script.on('close', resolve);
            script.on('error', reject);
        });
        
        if(!exit_code) {
            console.error(`Invalid subprocess exit code: ${exit_code}`);
            throw new InternalServerErrorException();
        }
    }

    async testSpeaker(sid: number, file: Express.Multer.File): Promise<boolean> {
        const speaker = await this.speaker.findOne(sid);
        
        const script = ps.spawn('python3', [SpeakersService.TEST_SPEAKER_SCRIPT]);
        if(!script.stdin.write(speaker.model_path)) {
            console.error('Transmission to subprocess error');
            throw new InternalServerErrorException();
        }

        try {
            return new Promise((resolve, reject) => {
                file.stream.on('data', chunk => script.stdin.write(chunk))
                file.stream.on('end', () => script.stdin.end());
                file.stream.on('error', reject);
                script.on('close', () => {
                    const answer = script.stdout.read();
                    resolve(Boolean(answer));
                })
                script.on('error', reject);
            })
        } catch(e) {
            console.error(e);
            throw new InternalServerErrorException();
        }
    }
}
