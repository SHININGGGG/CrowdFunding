import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AlphaDemoPageComponent} from './pages/alpha-demo-page/alpha-demo-page.component';
import {PanelComponent} from './pages/panel/panel.component';
import {MainFrameComponent} from './pages/main-frame/main-frame.component';
import { UserComponent } from './pages/user/user.component';
import { ProjectComponent } from './pages/project/project.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageProjectComponent } from './pages/manage-project/manage-project.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';

const routes: Routes = [
  {path: 'demo', component: AlphaDemoPageComponent},
  {path: 'panel', component: PanelComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '',redirectTo: '/main/homepage', pathMatch: 'full'},
  {
    path: 'main', component: MainFrameComponent,
    children: [
      {path: 'homepage', component: HomeComponent},
      {path: 'profile', component: UserComponent},
      {path: 'project/:projectId', component: ProjectComponent},
      {path: 'user', component: UserComponent},
      {path: 'manage-project', component: ManageProjectComponent},
      {path: 'manage-project/:projectId', component: ManageProjectComponent},
      {path: 'admin', component: AdminComponent},
      {path: 'project-list', component: ProjectListComponent},
      {path: 'project-list/:searchConfig', component: ProjectListComponent},
      {path: 'leaderboard', component: LeaderboardComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
