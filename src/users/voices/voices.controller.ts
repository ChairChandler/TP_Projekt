import { Controller, Get, Post, Param, Delete, UseInterceptors, HttpCode, HttpStatus, Res, Header, UploadedFiles, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RolesGuard } from 'src/roles.guard';
import { TokenGuard } from 'src/token.guard';
import { Role, Roles } from 'utils/roles';
import { VoiceDTO } from './dto/voice.dto';
import { VoiceEntity } from './entities/voice.entity';
import { VoicesService } from './voices.service';

@Controller('api/users/:name/voices')
@Role([Roles.HEAD_ADMIN, Roles.ADMIN])
@UseGuards(TokenGuard, RolesGuard)
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 50))
  async create(
    @Param('name') name: string, 
    @UploadedFiles() files: Express.Multer.File[]): Promise<void> {

      for(const f of files) {
        await this.voicesService.create(name, f);
      }
  }

  @Get()
  async findAll(@Param('name') name: string): Promise<VoiceDTO[]> {
    const voices: VoiceEntity[] = await this.voicesService.findAll(name);
    return voices.map(v => ({id: v.id, path: v.path}));
  }

  @Get(':vid')
  @Header('Content-Type', 'audio/wav')
  async loadFile(
    @Res({passthrough: true}) res: Response, 
    @Param('vid') vid: string): Promise<void> {

    const stream = await this.voicesService.loadFile(Number.parseInt(vid));
    stream.pipe(res);
  }

  @Get(':vid')
  async findOne(@Param('vid') vid: string): Promise<VoiceDTO> {
    const voice_entity = await this.voicesService.findOne(Number.parseInt(vid));
    return {
      id: voice_entity.id, 
      path: voice_entity.path
    }
  }

  @Delete(':vid')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('vid') vid: string): Promise<void> {
    return this.voicesService.remove(Number.parseInt(vid))
  }
}
