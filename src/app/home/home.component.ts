import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    NewRequest: any;
    currentUser: User;
    users: User[] = [];
    ActiveTab: any = 'Dashboard';
    ActionList: any = {
        'EQANewRequests': 'EQA New Requests',
        'EQASummary':'EQA Summary',
        'InitiateEQARequest':'Initiate EQA Request',
        'TeamEQARequest':'Request History'
    }

    constructor(private userService: UserService) {
        console.log(localStorage.getItem('currentUser'))
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }
 
    deleteUser(_id: string) {
        this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }
 
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
    doAction(actionName: string) {
        this.ActiveTab = actionName;
    }


}