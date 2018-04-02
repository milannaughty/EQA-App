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
        'AssociateRequestDetail':'Request Detail',
        'InitiateEQARequest':'Initiate EQA Request',
        'TeamEQARequest':'Request History',
        'TeamRequestDetail':'Request Detail',
        'PanelList':'Panel List',
        'PanelDetail':'Panel Detail'
    }

    constructor(private userService: UserService) {
        console.log(localStorage.getItem('currentUser'))
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        // this.loadNewRequestForAssociate();
    }

    deleteUser(id: number) {
        // this.userService.delete(id).subscribe(() => { this.loadNewRequestForAssociate() });
    }

    doAction(actionName: string) {
        this.ActiveTab = actionName;
    }


}