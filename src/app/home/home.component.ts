import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentRequestData: any;
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
        'TeamRequestDetail': 'Request Summary Detail',
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
        let cachedUser = sessionStorage.getItem('currentUser');
        if (!cachedUser)
            this.router.navigate(['/login']);
        else {
            this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (this.currentUser.isAdmin) {
                this.router.navigate(['/admin']);
            }
        }
    }

    ngOnInit() {
        console.log('In ngOnInit Method');
        this.userService.GetAssociateNewRequest(this.currentUser.id).subscribe(result => {
            this.NewRequestCount = result;
            this.NewRequestCount = Array.from(this.NewRequestCount).length;
        });
        this.ActiveTab = this.ActionList.EQANewRequests;
        this.ActiveTab = this.ActionList.EQASummary;
        this.ActiveTab = this.ActionList.TeamRequestDetail;
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
    ShowRequestDetails(actionData) {
        debugger;
        this.currentRequestData = actionData.data;
<<<<<<< HEAD
=======
        this.currentRequestData["currentUser"]=this.currentUser;
        this.currentRequestData["prevActiveTab"]=this.ActiveTab;
>>>>>>> d6cb9a71c82070715f5cd11739c6983a8a59cf63
        this.ActiveTab = actionData.ActivateTab;

    }
    ShowRequestList(mssgEvent) {
        this.ActiveTab = mssgEvent.ActivateTab;
    }
    ShowRequestList1(mssgEvent) {
        debugger;   
        this.ActiveTab = this.ActionList.TeamEQARequest;;
    }
}