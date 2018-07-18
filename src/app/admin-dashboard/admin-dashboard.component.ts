import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import { RequestService } from '../_services/index';
import { UserService } from "../_services/user.service";
import { Router } from '@angular/router';
//import { ModalComponent } from '../_directives/index';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// import { NgbdModalBasic } from './modal-basic.component'


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentRequestData: any;
  NewRequest: Object;
  AssignEnabled: boolean = false;
  skillSetCount = 0;
  AdminActiveTab: any;
  loading: boolean;
  currentUser: User;

  ActionList: any = {
    'AdminTeamRequest': 'HOME',
    'TeamRequestDetails': 'REQUEST_DETAIL',
    'AddPanel':'ADD_PANEL'
  }

  constructor(private requestService: RequestService, private userService: UserService,private router: Router) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!this.currentUser || !this.currentUser.isAdmin)
      this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.AdminActiveTab = this.ActionList.AdminTeamRequest;
  }

  ShowRequestDetails(data) {
    this.AdminActiveTab = data.ActivateTab || this.ActionList.TeamRequestDetails;
    this.currentRequestData = data.data || data;
    var keys = Object.keys(this.currentRequestData.skillSet);
    this.skillSetCount = keys.length;
  }
  ShowRequestList(mssgEvent) {
    this.AdminActiveTab = this.ActionList.AdminTeamRequest;;
  }

  public getSkillCountOfCurrentRequest() {
    return this.skillSetCount;
  }
  doAction( actionName) {
    this.AdminActiveTab = actionName;
    
  }
}
