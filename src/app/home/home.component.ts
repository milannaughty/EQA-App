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
    currentRequestData: any = {};
    NewRequestCount: any;
    NewRequest: any;
    currentUser: User;
    ActiveTabs: any;
    users: User[] = [];
    ActiveTab: any = 'Dashboard';
    ActionList: any = userConfig.ActionList;
    el: ElementRef;
    navOpen: boolean = false;
    summaryData: { status: string; count: any; }[];
    totalRequestCount: any;
    completedRequestCount: any;
    underReviewRequestCount: any;
    assignedRequestCount: any;
    inprogressRequestCount: number;
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
            this.GetPanelRequestCountWithStatus()

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

    GetPanelRequestCountWithStatus() {
        this.requestService.GetPanelRequestCountWithStatus(this.currentUser["_id"], this.currentUser["panelType"])
            .subscribe(result => {
                this.ShowRequestCount(result)
            }, err => {
                //debugger;
            });
    }
    ShowRequestCount(requestCountResp) {
        this.totalRequestCount = 0;
        this.completedRequestCount = 0;
        this.underReviewRequestCount = 0;
        this.assignedRequestCount = 0;
        this.inprogressRequestCount = 0;
        requestCountResp.map((x) => {
            this.totalRequestCount += x.count;
            switch (x.status) {
                case adminConfig.RequestStatus.COMPLETED.DBStatus: this.completedRequestCount = x.count; break;
                case adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus: this.underReviewRequestCount = x.count; break;
                case adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus: this.assignedRequestCount = x.count; break;
                case adminConfig.RequestStatus.IN_PROGRESS.DBStatus: this.inprogressRequestCount = x.count; break;
            }
        })

    }
    // ShowRequestCounts() {
    //     this.newRequestCount = this.GetCount(adminConfig.RequestStatus.NEW.DBStatus);
    //     this.assignedRequestCount = this.GetCount(adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus);
    //     this.inProgressRequestCount = this.GetCount('ALL');
    // }
    GetCount(DBRequestStatus) {
        var sum = 0;
        var arr = [];
        if ('ALL' == DBRequestStatus) {
            arr = this.summaryData.filter(x => x.status == adminConfig.RequestStatus.REJECTED.DBStatus || x.status == adminConfig.RequestStatus.COMPLETED.DBStatus || x.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus || x.status == adminConfig.RequestStatus.IN_PROGRESS.DBStatus);
            arr.map(function (DBRequestStatus) { sum += DBRequestStatus.count });
            return sum;
        }
        else {
            arr = this.summaryData.filter(x => x.status == DBRequestStatus);
            if (arr && arr.length > 0) return arr[0].count; return 0;
        }
    }
    deleteUser(_id: string) {
        // this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }


    doAction(actionName: string, e) {
        this.ActiveTab = actionName;
        this.currentRequestData['CurrentActionName'] = actionName;
        $(".nav-pills li").removeClass("active")
        var e = e;
        e.target.parentElement.setAttribute("class", "active");
    }
    ShowRequestDetails(actionData) {
        if (actionData.updateRequestCount) {
            this.GetPanelRequestCountWithStatus();
        }
        else {
            this.currentRequestData = {};
            this.currentRequestData["body"] = actionData.data;
            this.currentRequestData["currentUser"] = this.currentUser;
            this.currentRequestData["prevActiveTab"] = this.ActiveTab;
            this.ActiveTab = actionData.ActivateTab;
        }
    }
    ShowRequestList(mssgEvent) {
        this.GetPanelRequestCountWithStatus();
        this.ActiveTab = mssgEvent.ActivateTab;
    }
    ShowRequestList1(mssgEvent) {
        this.GetPanelRequestCountWithStatus();
        this.ActiveTab = this.ActionList.TeamEQARequest;;
    }
    navToggle() {
        this.navOpen = !this.navOpen;
        console.log(this.navOpen);
    }
}