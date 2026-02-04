import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RegisterUserCommand } from '../../application/dto/register-user.command';
import { LoginCommand } from '../../application/dto/login.command';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUC: RegisterUserUseCase,
    private readonly loginUC: LoginUseCase,
  ) {}

  @ApiOperation({ summary: 'Registrar usuario' })
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUC.execute(new RegisterUserCommand(dto.email, dto.password));
    // ⚠️ Nunca retornes passwordHash
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @ApiOperation({ summary: 'Login (retorna accessToken JWT)' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUC.execute(new LoginCommand(dto.email, dto.password));
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retorna el usuario autenticado (actor)' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user; // { userId, email, role }
  }
}
