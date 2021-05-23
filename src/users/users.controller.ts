import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Role, Roles } from 'utils/roles';
import { UserDTO } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@Role([Roles.HEAD_ADMIN])
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  add(@Res({passthrough: true}) res: Response,
    @Body() user: UserDTO): void {

    const name = this.userService.create(user.name, user.password, user.role);
    res.location(name);
  }

  @Get()
  async getAll(): Promise<UserDTO[]> {
    const data: UserEntity[] = await this.userService.getAll()
    return data.map(d => ({name: d.name, password: d.password, role: d.role}));
  }

  @Get(':name')
  getOne(@Param('name') name: string): Promise<UserDTO> {
    return this.userService.findOne(name);
  }

  @Patch(':name/role')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeRole(@Param('name') name: string, @Body('role') role: Roles): Promise<void> {
    return this.userService.setRole(name, role);
  }

  @Patch(':name/speaker')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeSpeaker(@Param('name') name: string, @Body('speaker') speaker: number): Promise<void> {
    return this.userService.setSpeaker(name, speaker);
  }

  @Delete(':name/speaker')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('name') name: string): Promise<void> {
    return this.userService.remove(name);
  }
}
