import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    roleList: any;
    selectedSkills: number[];
    dropdownSettings = {};
    skillList:any;
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.model.roleId = 1;
        this.roleList = [
            {
                "Id": 1,
                "Name": "Team"
            },
            {
                "Id": 2,
                "Name": "Panel"
            },
            {
                "Id": 3,
                "Name": "Associate"
            }]
        this.skillList = [
            { id: 1, itemName: 'Java' },
            { id: 2, itemName: 'Ruby' },
            { id: 3, itemName: 'PHP' },
            { id: 4, itemName: 'Python' },
            { id: 5, itemName: 'SQL' },
            { id: 6, itemName: 'ASP.NET' },
            { id: 7, itemName: 'ASP.NET MVC' },
            { id: 8, itemName: 'Web API' },
            { id: 9, itemName: 'SQL Server' },
            { id: 10, itemName: 'ASP.NET MVC' },
            { id: 11, itemName: 'AWS' },
            { id: 12, itemName: 'Node.js' },
            { id: 13, itemName: 'Ruby on Rails' },
            { id: 14, itemName: 'C' },
            { id: 15, itemName: 'C++' },
            { id: 16, itemName: 'C#' },
        ].sort((x,y)=> x.itemName.localeCompare(y.itemName));
        this.dropdownSettings = { 
            singleSelection: false, 
            text:"Select Skillset",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true
          };    
    }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
