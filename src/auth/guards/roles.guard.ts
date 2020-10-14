import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../../user/interface/user.interface';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject(forwardRef(() => UserService)) private userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserInterface = request.user.user;

    return this.userService.findOne(user.id).pipe(
      map((user: UserInterface) => {
        const hasRole = () => roles.indexOf(user.role) > -1
        let hasPermission = false
        if(hasRole()) {
          hasPermission = true
        } else {
          throw new HttpException("You don't have sufficient role to access this route", 401)
        }
        return user && hasPermission
      }),
      catchError(err => {
        throw new HttpException("You don't have sufficient role to access this route", 401)
      })
    )
  }
}
