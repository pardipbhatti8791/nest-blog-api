import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'name field is required' })
  @IsString()
  readonly name: string

  @ApiProperty({ description: 'username field is required' })
  @IsString()
  readonly username: string;
}
