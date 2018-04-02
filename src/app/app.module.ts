import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { JwtInterceptor,JwtInterceptorProvider } from './_helpers/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';

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

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing,
        AngularMultiSelectModule,
        NgDatepickerModule
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
        TeamPanelDetailComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        JwtInterceptorProvider,
        UserService,
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