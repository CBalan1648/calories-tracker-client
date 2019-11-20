import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { UserService } from '../Services/user.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private token: string;

    constructor(private readonly userService: UserService) {
        userService.getUserObservable().pipe(filter(user => user)).subscribe(newUser => {
            this.token = newUser.token;
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.token}`
            }
        });

        return next.handle(request);
    }
}
