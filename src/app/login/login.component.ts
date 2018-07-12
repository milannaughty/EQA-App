import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    loginAsList: any;
    currentUser: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        this.loginAsList = [
            {
                "Id": 1,
                "Name": "Team"
            },
            {
                "Id": 2,
                "Name": "Panel"
            }]
        this.model.loginAsId = 1
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        if(this.model.loginAsId === 1){
            this.model.isPanel = false;
        }
        else {
            this.model.isPanel = true;
        }
        this.authenticationService.login(this.model.username, this.model.password, this.model.isPanel)
            .subscribe(
            data => {
                this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.router.navigate(this.currentUser.isAdmin ? ['admin'] : ['home']);
            },
            error => {
                this.alertService.error(JSON.stringify(error.error));
                this.loading = false;
            });
    }
}
