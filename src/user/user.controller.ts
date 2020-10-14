import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterface, UserRole } from './interface/user.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { catchError } from 'rxjs/operators';
import { hasRoles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Authentication & User Data')
@Controller('user/v1')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('auth/signup')
  create(@Body() user: UserDto): Observable<UserInterface> {
    return this.userService.create(user).pipe(map((user: any) => user));
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto): Observable<Object> {
    return this.userService.login(loginDto).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<UserInterface> {
    return this.userService.findOne(id).pipe(
      map(user => {
        if (!user) {
          throw new HttpException(
            `User with #${id} not found`,
            HttpStatus.NOT_FOUND,
          );
        } else {
          return user
        }
      }),
    );
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAllUsers() {
    return this.userService.findAll().pipe(
      map(user => user),
      catchError(err => {
        throw new HttpException(err, err.status);
      }),
    );
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
