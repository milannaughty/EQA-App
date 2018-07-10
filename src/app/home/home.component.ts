import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    NewRequestCount: any;
    NewRequest: any;
    currentUser: User;
    ActiveTabs: any;
    users: User[] = [];
    ActiveTab: any = 'Dashboard';
    ActionList: any = {
        'EQANewRequests': 'IQA New Requests',
        'EQASummary': 'IQA Summary',
        'AssociateRequestDetail': 'Request Detail',
        'InitiateEQARequest': 'Initiate IQA Request',
        'TeamEQARequest': 'Request History',
        'TeamRequestDetail': 'Request Detail',
        'PanelList': 'Panel List',
        'PanelDetail': 'Panel Detail'
    }

    receiveMessage($event) {
        console.log('In receiveMessage Method');
        this.ActiveTabs = $event
    }

    changeMessageEvent(mssgEvent) {
        console.log('In receiveMessage Method');
        this.ActiveTab = mssgEvent.ActiveTabChildParam;
    }
    constructor(private userService: UserService, private router: Router) {
        let cachedUser = localStorage.getItem('currentUser');
        if (!cachedUser)
            this.router.navigate(['/login'])
        else
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        console.log('In ngOnInit Method');
        this.userService.GetAssociateNewRequest(this.currentUser.id).subscribe(result => {
            this.NewRequestCount = result;
            this.NewRequestCount = Array.from(this.NewRequestCount).length;
        });
    }

    deleteUser(_id: string) {
        // this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
    doAction(actionName: string) {
        this.ActiveTab = actionName;
    }


}