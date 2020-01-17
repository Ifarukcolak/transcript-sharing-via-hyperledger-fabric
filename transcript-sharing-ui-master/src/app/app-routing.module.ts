import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { TranscriptListComponent } from './pages/transcript/transcript-list/transcript-list.component';
import { TranscriptFormComponent } from './pages/transcript/transcript-form/transcript-form.component';
import { HomeComponent } from './pages/home/home.component';
import { HistoryComponent } from './pages/history/history.component';
import { ExamineComponent } from './pages/examine/examine.component';


const routes: Routes = [
{ path: 'login', component: LoginComponent},

 { path: ':okul',
  component: DashboardComponent,
  children: [
    { path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
    { path: 'transcipt', component: TranscriptListComponent,canActivate:[AuthGuard]},
    { path: 'transcipt/:mode/:id', component: TranscriptFormComponent,canActivate:[AuthGuard]},
    { path: 'transcipt/:mode', component: TranscriptFormComponent,canActivate:[AuthGuard]},
    { path: 'transciptone/examine/:id', component: ExamineComponent,canActivate:[AuthGuard]},

    { path: 'history', component: HistoryComponent,canActivate:[AuthGuard]},


  ]},
  { path: '**', redirectTo: 'login'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
 
 
}
