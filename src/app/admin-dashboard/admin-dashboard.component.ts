import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import { RequestService } from '../_services/index';
import { UserService } from "../_services/user.service";
import { Router } from '@angular/router';
import { adminConfig } from "../app.config";
import * as $ from 'jquery';
//import { ModalComponent } from '../_directives/index';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// import { NgbdModalBasic } from './modal-basic.component'


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  completedRequestCount: any;
  inProgressRequestCount: any;
  assignedRequestCount: any;
  rejectRequestCount: any;
  summaryData: { status: string; count: any; }[];
  currentRequestData: any = {};
  NewRequest: Object;
  AssignEnabled: boolean = false;
  skillSetCount = 0;
  AdminActiveTab: any;
  loading: boolean;
  currentUser: User;

  ActionList = adminConfig.ActionList;
  RequestStatus = adminConfig.RequestStatus;
  newRequestCount: any;
  underReviewRequestCount: any;

  constructor(private requestService: RequestService, private userService: UserService, private router: Router) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!this.currentUser || !this.currentUser.isAdmin)
      this.router.navigate(['/login']);
    else
      this.currentRequestData["currentUser"] = this.currentUser;
  }

  ngOnInit() {
    this.AdminActiveTab = this.ActionList.AdminTeamRequest;
    this.requestService.getAll().subscribe(result => {
      this.loading = false;
      var counts = result.reduce((p, c) => {
        var name = c.status;
        if (!p.hasOwnProperty(name)) {
          p[name] = 0;
        }
        p[name]++;
        return p;
      }, {});
      this.summaryData = Object.keys(counts).map(k => { return { status: k, count: counts[k] }; });
      this.ShowRequestCounts();
    })
  }

  ShowRequestCounts() {
    this.newRequestCount = this.GetCount(adminConfig.RequestStatus.NEW.DBStatus);
    this.underReviewRequestCount = this.GetCount(adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus);
    this.rejectRequestCount = this.GetCount(adminConfig.RequestStatus.REJECTED.DBStatus);
    this.assignedRequestCount = this.GetCount(adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus);
    this.inProgressRequestCount = this.GetCount(adminConfig.RequestStatus.IN_PROGRESS.DBStatus);
    this.completedRequestCount = this.GetCount(adminConfig.RequestStatus.COMPLETED.DBStatus);
  }
  GetCount(DBRequestStatus) {
    var arr = this.summaryData.filter(x => x.status == DBRequestStatus);
    if (arr && arr.length > 0) return arr[0].count; return 0;
  }

  ShowRequestDetails(data) {
    this.ShowRequestCounts();
    this.AdminActiveTab = data.ActivateTab || this.ActionList.TeamRequestDetails;
    this.currentRequestData = data.data || data;
    this.currentRequestData["currentUser"] = this.currentUser;
    var keys = Object.keys(this.currentRequestData.skillSet);
    this.skillSetCount = keys.length;
  }

  ShowRequestList(mssgEvent) {
    this.AdminActiveTab = mssgEvent.ActivateTab;
  }

  public getSkillCountOfCurrentRequest() {
    return this.skillSetCount;
  }
  doAction(actionName) {
    this.AdminActiveTab = actionName;
    this.currentRequestData['CurrentActionName'] = actionName;
  }
  navToggle(){
    $(".breadcrumb.left-nav").toggleClass("open");
  }
}
