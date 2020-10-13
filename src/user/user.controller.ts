import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterface } from './interface/user.interface';
import { Observable } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Post()
  create(@Body() user: UserDto): Observable<UserInterface> {
    return this.userService.create(user)
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<UserInterface> {
    return this.userService.findOne(id)
  }

  @Get()
  findAllUsers() {
    return this.userService.findAll()
  }

  @Delete()
  deleteOne(@Param() params) {
    return this.userService.deleteOne(params.id)
  }

  @Post('edit/:id')
  udpateOneuser(@Param('id') id: number, @Body() user: UserDto) {
    return this.userService.updateOne(id, user)
  }

}
