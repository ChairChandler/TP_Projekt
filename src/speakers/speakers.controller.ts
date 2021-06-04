import { Body, Controller, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RolesGuard } from 'src/roles.guard';
import { TokenGuard } from 'src/token.guard';
import { Role, Roles } from 'utils/roles';
import { SpeakerDTO } from './dto/speaker.dto';
import { SpeakersService } from './speakers.service';

@Controller('api/speakers')
@UseGuards(TokenGuard)
export class SpeakersController {
    constructor(private speakersSerivice: SpeakersService) {}

    @Post()
    @Role([Roles.HEAD_ADMIN, Roles.ADMIN])
    @UseGuards(RolesGuard)
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
