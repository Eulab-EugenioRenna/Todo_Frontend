import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = getJwtTokwn();

  if (auth) {
    const requested = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth}`,
      },
    });
    return next(requested);
  }
  return next(req);
};

function getJwtTokwn(): string | null {
  return localStorage.getItem('JWT_TOKEN');
}
