import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { UserInterface } from '../user/interface/user.interface';
import { catchError, switchMap, switchMapTo } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {}

  /**
   *
   * @param user
   */
  generateJwtToken(user: UserInterface): Observable<string> {
    return from(this.jwtService.signAsync({ user }))
  }

  /**
   *
   * @param password
   */
  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12))
  }

  /**
   *
   * @param client_password
   * @param db_password
   */
  comparePassword(client_password: string, db_password: string): Observable<any | boolean> {
    return from<any | boolean>(bcrypt.compare(client_password, db_password))
  }

}
