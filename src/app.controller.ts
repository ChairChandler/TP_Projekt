import { Controller, Get, HttpStatus, Render, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { Role, Roles } from 'utils/roles';
import { RolesGuard } from './roles.guard';
import { TokenGuard } from './token.guard';

@Controller()
export class AppController {
  @Get()
  getLoginPage(@Req() req: Request, @Res() res: Response): void {
    if(req.cookies['token']) {
      res.status(HttpStatus.SEE_OTHER).location('/user').send();
    } else {
      res.render('login.hbs');
    }
  }

  @Get('user')
  @UseGuards(TokenGuard)
  @Render('user_dashboard.hbs')
  getUserDashboard(): void {}

  @Get('admin')
  @Role([Roles.HEAD_ADMIN, Roles.ADMIN])
  @UseGuards(TokenGuard, RolesGuard)
  @Render('admin_dashboard.hbs')
  getAdminDashboard(): void {}

  @Get('head_admin')
  @Role([Roles.HEAD_ADMIN])
  @UseGuards(TokenGuard, RolesGuard)
  @Render('head_admin_dashboard.hbs')
  getHeadAdminDashboard(): void {}
}
