import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RolesGuard } from 'src/roles.guard';
import { TokenGuard } from 'src/token.guard';
import { Role, Roles } from 'utils/roles';
import { UserAdvancedDTO, UserAdvancedEditDTO } from './dto/userAdvanced.dto';
import { UserBaseDTO } from './dto/userBase';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
@Role([Roles.HEAD_ADMIN])
@UseGuards(TokenGuard, RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async add(@Res({passthrough: true}) res: Response,
    @Body() user: UserAdvancedDTO): Promise<void> {

    const name = await this.userService.create(user.name, user.password, user.role);
    res.location(name);
  }

  @Get()
  async getAll(): Promise<UserBaseDTO[]> {
    const data: UserEntity[] = await this.userService.getAll();
    return data.map(d => ({name: d.name, role: d.role}));
  }

  @Get(':name')
  getOne(@Param('name') name: string): Promise<UserBaseDTO> {
    return this.userService.findOne(name);
  }

  @Put(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('name') name: string, @Body() body: UserAdvancedEditDTO): Promise<void> {
    await this.userService.setRole(name, body.role);
    if(body.password) {
      await this.userService.setPassword(name, body.password);
    }
  }

  @Patch(':name/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Param('name') name: string, @Body('password') password: string): Promise<void> {
    return this.userService.setPassword(name, password);
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

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('name') name: string): Promise<void> {
    return this.userService.remove(name);
  }
}
