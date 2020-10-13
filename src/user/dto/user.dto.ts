import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'name field is required' })
  @IsString()
  readonly name: string

  @ApiProperty({ description: 'email required and it must be unique' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password is required' })
  @IsString()
  readonly password: string
}
