import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor<T> implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {
  }

  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    this.loadingService.showLoadingBar();
    return next.handle(req).pipe(
      map((event: HttpEvent<T>) => {
        if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
          this.loadingService.hideLoadingBar();
        }
        return event;
      }),
      catchError((error: any) => {
        this.loadingService.hideLoadingBar();
        return throwError(error);
      })
    );
  }
}
