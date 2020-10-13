import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './interface/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoginInterface } from './interface/login.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  /**
   *
   * @param user
   */
  create(user: UserInterface): Observable<UserInterface> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        user.password = passwordHash;
        return from(this.userRepository.save(user));
      }),
      catchError(e => {
        if (e.code && e.code === '23505') {
          throw new ConflictException(e.message);
        } else {
          throw new BadRequestException();
        }
      }),
    );
  }

  /**
   *
   * @param user
   */
  login(user: LoginDto): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: UserInterface) => {
        return this.authService
          .generateJwtToken(user)
          .pipe(map((jwt: string) => jwt));
      }),
      catchError(e => {
        throw new UnauthorizedException();
      }),
    );
  }

  /**
   *
   * @param email
   * @param password
   */
  validateUser(email: string, password: string): Observable<UserInterface> {
    return this.findByEmail(email).pipe(
      switchMap((user: any) => {
        return this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            switch (match) {
              case true:
                return user;
              case false:
                throw new UnauthorizedException();
            }
          }),
        );
      }),
    );
  }

  findByEmail(email: string): Observable<UserInterface> {
    return from(this.userRepository.findOne({ email }))
  }

  findAll(): Observable<UserInterface[]> {
    return from(this.userRepository.find());
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: UserDto): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  findOne(id: number): Observable<UserInterface> {
    return from(this.userRepository.findOne(id));
  }
}
