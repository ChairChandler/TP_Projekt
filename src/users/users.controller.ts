import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Role, Roles } from 'utils/roles';
import { UserDTO } from './dto/user.dto';

@Controller('users')
@Role([Roles.HEAD_ADMIN])
export class UsersController {
  @Get()
  getAll(): UserDTO[] {
    return ;
  }

  @Get(':id')
  getOne(@Param('id') id: number): UserDTO {
    return
  }

  @Post()
  add(@Body() user: UserDTO): void {

  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeRole(@Param('id') id: number, @Body('role') role: Roles): void {

  }

  @Patch(':id/speaker')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeSpeaker(@Param('id') id: number, @Body('speaker') speaker: number): void {

  }

  @Delete(':id/speaker')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): void {

  }
}
