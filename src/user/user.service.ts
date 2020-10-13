import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './interface/user.interface';
import { Observable, from } from 'rxjs';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(user: UserInterface): Observable<UserInterface> {
    return from(this.userRepository.save(user))
  }

  findAll(): Observable<UserInterface[]> {
    return from(this.userRepository.find())
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id))
  }

  updateOne(id: number, user: UserDto): Observable<any> {
    return from(this.userRepository.update(id, user))
  }

  findOne(id: number): Observable<UserInterface> {
    return from(this.userRepository.findOne(id))
  }
}
