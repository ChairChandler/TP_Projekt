import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TokenDTO } from 'src/users/tokens/dto/token.dto';
import { TokensService } from './tokens.service';

@Controller('api/users/:name/token')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  async signIn(@Res({passthrough: true}) res: Response,
    @Param('name') name: string,
    @Body() body: TokenDTO): Promise<void> {

    const user = await this.tokensService.signIn(name, body.password);
    res.cookie('token', user.token, {
      httpOnly: true, 
      maxAge: 60*60*24
    }).cookie('role', user.role, {
      httpOnly: true, 
      maxAge: 60*60*24
    });
  }
}
