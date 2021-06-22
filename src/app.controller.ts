import { Controller, Get, HttpStatus, Render, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { Role, Roles } from 'utils/roles';
import { RolesGuard } from './roles.guard';
import { SpeakersService } from './speakers/speakers.service';
import { TokenGuard } from './token.guard';
import { TokensService } from './users/tokens/tokens.service';
import { UsersService } from './users/users.service';
import { VoicesService } from './users/voices/voices.service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private speakerService: SpeakersService,
    private usersService: UsersService,
    private tokensService: TokensService,
    private voicesService: VoicesService) {}

  @Get()
  getLoginPage(@Req() req: Request, @Res() res: Response): void {
    if(req.cookies['token']) {
      if(this.tokensService.isLogged(req.cookies['token'])) {
        res.status(HttpStatus.SEE_OTHER).location('/user').send();
      } else {
        res.cookie('token', null, {expires: new Date()})
        .cookie('role', null, {expires: new Date()});
        res.render('login.hbs');
      }
    } else {
      res.render('login.hbs');
    }
  }

  @Get('user')
  @UseGuards(TokenGuard)
  @Render('dashboard.hbs')
  async getUserDashboard(@Req() req: Request) {
    const users = await this.usersService.getAll();
    const speakersBase = await this.speakerService.getSpeakers();
    
    return {
      page_role: 'user',
      user_info: this.getPrivileges(req),
      users,
      speakersBase
    };
  }

  @Get('admin')
  @Role([Roles.HEAD_ADMIN, Roles.ADMIN])
  @UseGuards(TokenGuard, RolesGuard)
  @Render('dashboard.hbs')
  async getAdminDashboard(@Req() req: Request) {
    const users = await this.usersService.getAll();
    const speakersAdvanced = await this.speakerService.getSpeakers();
    const files = await Promise.all(speakersAdvanced.map(async s => {
      const voices = await this.voicesService.findAll(s.uid);
      return {
        uid: s.uid, 
        sid: s.sid, 
        files: voices.map(v => ({
          id: v.id, 
          fname: path.basename(v.path)
        }))
      };
    }));
    

    return {
      page_role: 'admin',
      user_info: this.getPrivileges(req),
      users,
      files
    };
  }

  @Get('head_admin')
  @Role([Roles.HEAD_ADMIN])
  @UseGuards(TokenGuard, RolesGuard)
  @Render('dashboard.hbs')
  async getHeadAdminDashboard(@Req() req: Request) {
    const users = await this.usersService.getAll();
    
    return {
      page_role: 'head_admin',
      user_info: this.getPrivileges(req),
      users
    };
  }

  private getPrivileges(req: Request) {
    const role: Roles = req.cookies['role'];

    const head_admin = role == Roles.HEAD_ADMIN;
    const admin = role == Roles.ADMIN || head_admin;

    return {head_admin, admin};
  }
}
