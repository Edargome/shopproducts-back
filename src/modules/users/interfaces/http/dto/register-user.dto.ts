import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'contraseñaSegura' })
  @IsString()
  @MinLength(6)
  password!: string;
}
