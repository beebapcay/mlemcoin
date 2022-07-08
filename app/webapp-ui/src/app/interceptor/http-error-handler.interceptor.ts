import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

@Injectable()
export class HttpErrorHandlerInterceptor<T> implements HttpInterceptor {
  constructor(private snackbarService: SnackbarService) {
  }

  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<T>) => {
        return event;
      }),
      catchError((error: any) => {
        console.log(error); // TODO: remove this line when production
        this.snackbarService.openRequestErrorAnnouncement(error);
        return throwError(error);
      })
    );
  }
}
