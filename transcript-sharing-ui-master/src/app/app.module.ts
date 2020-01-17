import { TranscriptFormComponent } from './pages/transcript/transcript-form/transcript-form.component';
import { DemoMaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './services/AuthInterceptor.service';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './services/alert.service';
import { TranscriptListComponent } from './pages/transcript/transcript-list/transcript-list.component';
import { HomeComponent } from './pages/home/home.component';
import { TranscriptService } from './services/transcript.service';
import { HistoryComponent } from './pages/history/history.component';
import { ExamineComponent } from './pages/examine/examine.component';


@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      DashboardComponent,
      AlertComponent,
      TranscriptListComponent,
      TranscriptFormComponent,
      HomeComponent,
      HistoryComponent,
      ExamineComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      AngularFontAwesomeModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
   ],
   providers: [
      AuthService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
      AuthGuard,
      AlertService,
      TranscriptService

   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
