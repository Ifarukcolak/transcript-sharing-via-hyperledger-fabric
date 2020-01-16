import { catchError } from 'rxjs/operators';
import { Route, Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private router:Router) { }

  intercept(request, next) {
    var authService = this.injector.get(AuthService);
    if(authService.isAuthenticated){
      
      var authRequest = request.clone({
      headers : request.headers.set('username', authService.token)
      
    })
    console.log(authRequest);

    return next.handle(authRequest)
    
    }else{

      return next.handle(request)
    }


  }
}
