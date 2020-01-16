import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private router :Router ,private http:HttpClient) { }
  public LogInControl:boolean
  redirectUrl :string
  username:string
  path=environment.path
  public mesaj:string

  login(username: string,organization_name:string) {
    const params = new HttpParams()
    .set('organization_name', organization_name)
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json');
    headers = headers.append('username',username);

   return this.http.post(this.path + 'login?'+ params.toString(), {
      username: username,
    } , {headers:headers})
   .pipe(map(data => {
    
   
    this.saveToken(username)  

    return data
    }))
    }
   
  

  
  saveToken(token){
    sessionStorage.setItem(this.username,token)
  }

  logOut(){
    sessionStorage.removeItem(this.username)
  }

  get isAuthenticated():boolean{
    return !!sessionStorage.getItem(this.username)

  }

  get token(){
    return sessionStorage.getItem(this.username)
  }

}
