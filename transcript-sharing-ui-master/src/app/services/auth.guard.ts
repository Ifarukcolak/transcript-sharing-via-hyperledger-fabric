import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    

    constructor(private router: Router, private authService: AuthService){}
    
    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        
        if(!this.authService.isAuthenticated) {
            this.authService.redirectUrl = state.url
            this.router.navigateByUrl('/login');
            return false;
        }else{
            return true;
        }
    
    }
}