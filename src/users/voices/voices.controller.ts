import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoicesService } from './voices.service';
import { CreateVoiceDto } from './dto/create-voice.dto';
import { UpdateVoiceDto } from './dto/update-voice.dto';

@Controller('voices')
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Post()
  create(@Body() createVoiceDto: CreateVoiceDto) {
    return this.voicesService.create(createVoiceDto);
  }

  @Get()
  findAll() {
    return this.voicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoiceDto: UpdateVoiceDto) {
    return this.voicesService.update(+id, updateVoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voicesService.remove(+id);
  }
}
