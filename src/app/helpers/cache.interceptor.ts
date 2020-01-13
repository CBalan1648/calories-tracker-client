import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cachedData = new Map<string, HttpEvent<any>>();

    constructor(private userService: UserService) {
        userService.getUserObservable().subscribe(user => {
            if (!user._id) {
                this.cachedData.clear();
            }
        });
    }

    public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (httpRequest.method !== 'GET') {
            const cachedResponses = this.cachedData.keys();
            const requestUrl = httpRequest.url;
            for (const key of cachedResponses) {
                if (requestUrl.includes(key)) {
                    this.cachedData.delete(key);
                }
            }
            return next.handle(httpRequest);
        }

        const urlParts = httpRequest.url.split('/');
        const userId = urlParts[urlParts.length - 2];

        if (this.cachedData.has(userId)) {
            const cachedResponse = this.cachedData.get(userId);
            return of(cachedResponse);
        }

        const requestHandle = next.handle(httpRequest).pipe(tap(response => {
            if (response instanceof HttpResponse) {
                if (urlParts[urlParts.length - 1] === 'meals') {
                    this.cachedData.set(userId, response.clone());
                }
            }
        }));
        return requestHandle;
    }
}
