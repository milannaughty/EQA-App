import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';

import { FusionChartsModule } from 'angular4-fusioncharts';
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);
// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { JwtInterceptor, JwtInterceptorProvider } from './_helpers/index';
import { AlertService, AuthenticationService, UserService, RequestService, ModalService, SkillSetsService, EmailService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ResetUserPasswordComponent } from './reset-user-password/index';

//Third Party
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AssociateNewRequestListComponent } from './associate-new-request-list/associate-new-request-list.component';
import { TeamNewRequestComponent } from './team-new-request/team-new-request.component';
import { NgDatepickerModule } from 'ng2-datepicker';
import { TeamRequestListComponent } from './team-request-list/team-request-list.component';
import { TeamRequestDetailComponent } from './team-request-detail/team-request-detail.component';
import { AssociateRequestDetailComponent } from './associate-request-detail/associate-request-detail.component';
import { AssociateRequestListComponent } from './associate-request-list/associate-request-list.component';
import { TeamPanelListComponent } from './team-panel-list/team-panel-list.component';
import { TeamPanelDetailComponent } from './team-panel-detail/team-panel-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRequestComponent } from './admin-team-request/admin-team-request.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AdminTeamRequestDetailsComponent } from './admin-team-request-details/admin-team-request-details.component';
import { AdminTeamAddComponent } from './admin-team-add/admin-team-add.component';
import { NospacePipe } from './nospace.pipe';
import { AdminSkillSetComponent } from './admin-skill-set/admin-skill-set.component';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
//import { ResetUserPasswordComponent } from './reset-user-password/reset-user-password.component'; 
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing,
        AngularMultiSelectModule,
        NgDatepickerModule,
        FusionChartsModule,
        NgxSmartModalModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AssociateNewRequestListComponent,
        TeamNewRequestComponent,
        TeamRequestListComponent,
        TeamRequestDetailComponent,
        AssociateRequestDetailComponent,
        AssociateRequestListComponent,
        TeamPanelListComponent,
        TeamPanelDetailComponent,
        AdminDashboardComponent,
        AdminRequestComponent,
        AdminTeamRequestDetailsComponent,
        AdminTeamAddComponent,
        NospacePipe,
        AdminSkillSetComponent,
        AdminHomePageComponent,
        ResetUserPasswordComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        RequestService,
        SkillSetsService,
        ModalService,
        AuthenticationService,
        JwtInterceptorProvider,
        DatePipe,
        UserService,
        EmailService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }