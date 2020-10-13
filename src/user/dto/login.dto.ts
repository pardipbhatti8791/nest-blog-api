import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'email required and it must be unique' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password is required' })
  @IsString()
  readonly password: string
}
