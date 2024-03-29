import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    NewRequestCount: any;
    NewRequest: any;
    currentUser: User;
    users: User[] = [];
    ActiveTab: any = 'Dashboard';
    ActionList: any = {
        'EQANewRequests': 'EQA New Requests',
        'EQASummary': 'EQA Summary',
        'AssociateRequestDetail': 'Request Detail',
        'InitiateEQARequest': 'Initiate EQA Request',
        'TeamEQARequest': 'Request History',
        'TeamRequestDetail': 'Request Detail',
        'PanelList': 'Panel List',
        'PanelDetail': 'Panel Detail'
    }

    constructor(private userService: UserService) {
        console.log(localStorage.getItem('currentUser'))
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

        this.userService.GetAssociateNewRequest(this.currentUser.id).subscribe(result => {
            this.NewRequestCount = result;
            this.NewRequestCount = Array.from(this.NewRequestCount).length;
        });
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