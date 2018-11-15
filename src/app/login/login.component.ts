import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';

import { AlertService, AuthenticationService, UserService } from '../_services/index';

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
        private alertService: AlertService,
        private userService: UserService) {
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

        /**
         *  Initializing admin list
         */
        this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            var adminData;
            if (adminList instanceof Array)
                adminData= {
                    emailIDs:adminList.map(x=>x.username).join(',')
                    ,userNames:adminList.map(x=>x["FName"]+' '+x["LName"]).join(',')
                    }
            else
                adminData = {emailIDs:adminList["username"],userNames:adminList["FName"]+' '+adminList["LName"]};
            sessionStorage.setItem('adminList', JSON.stringify(adminData));
        },err => {
            console.log("Error while setting admin users");
        });
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
        this.model.username = this.model.username.toLocaleLowerCase();
        this.authenticationService.loginWithMongoAndLDAP(this.model.username, this.model.password)
            .subscribe(
            data => {
                //debugger;
                this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                this.router.navigate(this.currentUser.isAdmin ? ['admin'] : ['home']);
            },
            error => {
                //debugger;
                this.alertService.error(JSON.stringify(error.error));
                this.loading = false;
            });
    }
}
