import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  itu :boolean= false;
  yildiz:boolean=false;
  username:string
  organization_name:string

  constructor( public authService :AuthService,private alertService:AlertService,private router: Router) { }

  ngOnInit() {
    
  }
  login(username:string,form: NgForm){
    if (form.invalid) {
      this.alertService.error("Lutfen Bos alanlari Doldurunuz")
    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.alertService.clear();

 }, 3000);
      return;
  }
    this.authService.login(username,this.organization_name).subscribe(data=>{
      if(this.authService.isAuthenticated){
        
        this.router.navigate(['/'+this.getSchoolName+'/home']);
      }   
    },catchError=>{
      this.alertService.error(catchError['error'].message)
    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.alertService.clear();

 }, 3000);
})
    
    
    
  }
  get getSchoolName():string{
    let my_object=localStorage.getItem('school')
    return my_object
  }
  checkboxControl(itu:boolean,yildiz:boolean):boolean{
    let result:boolean
    if(itu==true && yildiz==true)
    {
      result=true
    }
    else if(itu==true && yildiz==false){
      result=false
      this.organization_name="itu"
      localStorage.setItem('school', this.organization_name)

    }
    else if(itu==false && yildiz==true){
      result=false
      this.organization_name="ytu"
      localStorage.setItem('school', this.organization_name)

    }else{
      result=true
    }

    return result
  }
  logOut(){
    this.authService.logOut()

  }
}
