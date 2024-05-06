import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const AuthInterceptor = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  request = request.clone({
    headers: request.headers.set('Authorization', localStorage.getItem('token') ?? '')
  })
  return next(request);
}