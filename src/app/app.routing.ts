import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ResetUserPasswordComponent } from './reset-user-password/index'
import { AuthGuard } from './_guards/index';
import { AdminDashboardComponent } from './admin-dashboard/index'

const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'admin#', component: AdminDashboardComponent },
    { path: 'forgotpassword', component: ResetUserPasswordComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);