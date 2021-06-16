import { Body, Controller, Delete, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenDTO } from 'src/users/tokens/dto/token.dto';
import { TokensService } from './tokens.service';

@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('api/users/:name/token')
  async signIn(@Res({passthrough: true}) res: Response,
    @Param('name') name: string,
    @Body() body: TokenDTO): Promise<void> {

    const user = await this.tokensService.signIn(name, body.password);
    
    const expires = new Date();
    expires.setDate(expires.getDate() + 1); // next day

    res.status(HttpStatus.SEE_OTHER)
    .cookie('token', user.token, {
      httpOnly: true, expires
    }).cookie('role', user.role, {
      httpOnly: true, expires
    }).location('/user');

    this.tokensService.createSignOutTask(expires, user.token);
  }

  @Delete('api/users/token')
  async signOut(@Res({passthrough: true}) res: Response,
    @Req() req: Request): Promise<void> {

    const token = req.cookies['token'];
    await this.tokensService.signOut(token);
    this.tokensService.cancelSignOutTask(token);

    res.cookie('token', null, {expires: new Date()})
    .cookie('role', null, {expires: new Date()})
    .status(HttpStatus.SEE_OTHER)
    .location('/');
  }
}
