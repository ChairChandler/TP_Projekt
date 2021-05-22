import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role, Roles } from 'utils/roles';
import { VoiceDTO } from './dto/voice.dto';
import { VoiceEntity } from './entities/voice.entity';
import { VoicesService } from './voices.service';

@Controller('users/:name/voices')
@Role([Roles.HEAD_ADMIN, Roles.ADMIN])
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('files'))
  create(@Param('name') name: string, 
    @UploadedFiles() files: Express.Multer.File[]): Promise<void> {

    return this.voicesService.create(name, files);
  }

  @Get()
  async findAll(@Param('name') name: string): Promise<VoiceDTO[]> {
    const voices: VoiceEntity[] = await this.voicesService.findAll(name);
    return voices.map(v => ({id: v.id, path: v.path}));
  }

  @Get(':vid')
  loadFile(@Param('vid') vid: string) {
    
  }

  @Get(':vid')
  findOne(@Param('name') name: string, @Param('vid') vid: string) {

  }

  @Delete(':vid')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('name') name: string, @Param('vid') vid: string) {

  }
}
