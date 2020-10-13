import { Body, Controller, Delete, Get, HttpException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterface } from './interface/user.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { catchError } from 'rxjs/operators';

@ApiBearerAuth()
@ApiTags('Authentication & User Data')
@Controller('user/v1')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('auth/signup')
  create(@Body() user: UserDto): Observable<UserInterface> {
    return this.userService.create(user).pipe(
      map((user: any) => user),
    );
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto): Observable<Object> {
    return this.userService.login(loginDto).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      })
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<UserInterface> {
    return this.userService.findOne(id);
  }

  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.userService.deleteOne(id);
  }

  @Post('edit/:id')
  udpateOneuser(@Param('id') id: number, @Body() user: UserDto) {
    return this.userService.updateOne(id, user);
  }
}
