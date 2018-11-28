import { Component, OnInit, ElementRef } from '@angular/core';

import { User } from '../_models/index';
import { RequestService } from '../_services/index';
import { Router } from '@angular/router';
import { userConfig, adminConfig } from "../app.config"
import * as $ from 'jquery';
@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentRequestData: any={};
    NewRequestCount: any;
    NewRequest: any;
    currentUser: User;
    ActiveTabs: any;
    users: User[] = [];
    ActiveTab: any = 'Dashboard';
    ActionList: any = userConfig.ActionList;
    el: ElementRef;
    navOpen: boolean = false;
    receiveMessage($event) {
        console.log('In receiveMessage Method');
        this.ActiveTabs = $event
    }

    changeMessageEvent(mssgEvent) {
        console.log('In receiveMessage Method');
        this.ActiveTab = mssgEvent.ActiveTabChildParam;
    }
    constructor(private requestService: RequestService, private router: Router, el: ElementRef) {
        this.el = el;
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
        //debugger;
        console.log('In ngOnInit Method');
        if (this.currentUser["isPanel"]) {
            // this.requestService.getPanelRequestCountWithStatus
            //     (this.currentUser["_id"], adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus)
            //     .subscribe(result => {
            //         this.NewRequestCount = result["count"];
            //     }, err => {
            //         //debugger;
            //     });
        }
        else {
            // this.requestService.getAssociateNewRequest(this.currentUser["_id"]).subscribe(result => {
            //     this.NewRequestCount = result;
            //     //debugger;
            //     this.NewRequestCount = Array.from(this.NewRequestCount).length;
            //});

            //TODO : show count for team request
        }
        //this.ActiveTab = this.ActionList.EQANewRequests;
    }

    deleteUser(_id: string) {
        // this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }


    doAction(actionName: string, e) {
        this.ActiveTab = actionName;
        debugger;
        this.currentRequestData['CurrentActionName'] = actionName;
        $(".nav-pills li").removeClass("active")
        var e = e;
        e.target.parentElement.setAttribute("class", "active");
    }
    ShowRequestDetails(actionData) {
        this.currentRequestData = {};
        this.currentRequestData["body"] = actionData.data;
        this.currentRequestData["currentUser"] = this.currentUser;
        this.currentRequestData["prevActiveTab"] = this.ActiveTab;
        this.ActiveTab = actionData.ActivateTab;
    }
    ShowRequestList(mssgEvent) {
        this.ActiveTab = mssgEvent.ActivateTab;
    }
    ShowRequestList1(mssgEvent) {
        this.ActiveTab = this.ActionList.TeamEQARequest;;
    }
    navToggle() {
        this.navOpen = !this.navOpen;
        console.log(this.navOpen);
    }
}