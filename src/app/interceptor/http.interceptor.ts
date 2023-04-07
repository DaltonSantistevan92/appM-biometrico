import { HttpInterceptorFn } from "@angular/common/http";


export const httpInterceptor : HttpInterceptorFn = (req, next) => {
    const token = JSON.parse(localStorage.getItem('token')!) || '';
  
    if (token) {
      req = req.clone({
        setHeaders:{ "Authorization":`Bearer ${token}` }
      });  
    }
    return next(req);
}
  