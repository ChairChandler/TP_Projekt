import { Body, Controller, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SpeakerDTO } from './dto/speaker.dto';
import { SpeakersService } from './speakers.service';

@Controller('speakers')
export class SpeakersController {
    constructor(private speakersSerivice: SpeakersService) {}

    @Post()
    async create(@Res({passthrough: true}) res: Response, @Body() body: SpeakerDTO) {
        const id = await this.speakersSerivice.createModel(body.owner);
        res.location(id.toString());
    }

    @Post(':sid')
    @UseInterceptors(FileInterceptor('file'))
    test(@Param('sid') sid: string,
        @UploadedFile() file: Express.Multer.File): Promise<boolean> {
            return this.speakersSerivice.testSpeaker(Number.parseInt(sid), file);
    }
}
