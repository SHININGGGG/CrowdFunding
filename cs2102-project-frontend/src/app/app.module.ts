import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AlphaDemoPageComponent } from './pages/alpha-demo-page/alpha-demo-page.component';
import { PanelComponent } from './pages/panel/panel.component';
import { MainFrameComponent } from './pages/main-frame/main-frame.component';
import { UserComponent } from './pages/user/user.component';
import { ProjectComponent } from './pages/project/project.component';
import {NgbModule, NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { ManageProjectComponent } from './pages/manage-project/manage-project.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';

import { TagInputModule } from 'ngx-chips';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProjectManagementComponent } from './pages/admin/project-management/project-management.component';
import { ReportManagementComponent } from './pages/admin/report-management/report-management.component';
import { SimpleModalComponent } from './modal/simple-modal/simple-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { UserProjectManagementComponent } from './pages/user/user-project-management/user-project-management.component';
import { UserReportManagementComponent } from './pages/user/user-report-management/user-report-management.component';
import { UserStatsManagementComponent } from './pages/user/user-stats-management/user-stats-management.component';
import { LogManagementComponent } from './pages/admin/log-management/log-management.component';
import { ProjectstatusPipe } from './pipes/projectstatus.pipe';
import { ProjectBoardComponent } from './pages/leaderboard/project-board/project-board.component';
import { UserBoardComponent } from './pages/leaderboard/user-board/user-board.component';
import { ProjectCommentComponent } from './pages/project/project-comment/project-comment.component';
import { ProjectStatsComponent } from './pages/project/project-stats/project-stats.component';
import { ProjectLeaderboardComponent } from './pages/project/project-leaderboard/project-leaderboard.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlphaDemoPageComponent,
    PanelComponent,
    MainFrameComponent,
    UserComponent,
    ProjectComponent,
    LoginComponent,
    ManageProjectComponent,
    RegisterComponent,
    AdminComponent,
    ProjectListComponent,
    ProjectManagementComponent,
    ReportManagementComponent,
    SimpleModalComponent,
    LeaderboardComponent,
    UserProjectManagementComponent,
    UserReportManagementComponent,
    UserStatsManagementComponent,
    LogManagementComponent,
    ProjectstatusPipe,
    ProjectBoardComponent,
    UserBoardComponent,
    ProjectCommentComponent,
    ProjectStatsComponent,
    ProjectLeaderboardComponent,
    UserManagementComponent
  ],
  entryComponents: [
    SimpleModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    TagInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    AngularFileUploaderModule
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}
    // {provide: NgbDateAdapter, useClass: NgbCustomDateAdapterService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
