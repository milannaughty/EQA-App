import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import { RequestService } from '../_services/index';
import { UserService } from "../_services/user.service";
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
  public skillSetCount = 0;
  OpenModal: boolean;
  closeResult: string;

  loading: boolean;
  users: User[] = [];

  currentUser: User;

  ActionList: any = {
    'AdminTeamRequest': 'HOME',
    'TeamRequestDetails': 'REQUEST_DETAIL'
  }

  AdminActiveTab: any;

  constructor(private requestService: RequestService, private userService: UserService) {
    console.log(localStorage.getItem('currentUser'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.AdminActiveTab = this.ActionList.AdminTeamRequest;
    this.loadNewRequestForAdmin();
  }

  private loadNewRequestForAdmin() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.requestService.getAll().subscribe(result => {
      this.loading = false;
      var resultTemp = result;
      this.NewRequest = result;
    });
  }

  ShowRequestDetails(data) {
    this.AdminActiveTab = this.ActionList.TeamRequestDetails;
    this.currentRequestData = data;
    var keys = Object.keys(this.currentRequestData.skillSet);
    this.skillSetCount = keys.length;

    //var panelList=this.userService.getPanelBySkills(this.currentRequestData.skillSet);
    // this.modalService.open(content).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  ShowRequestList() {
    this.AdminActiveTab = this.ActionList.TeamRequestDetails;;
    this.loadNewRequestForAdmin();
    // this.modalService.open(content).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  public getSkillCountOfCurrentRequest() {
    return this.skillSetCount;
  }
  // openModal(id: string) {
  //   debugger;
  //   this.modalService.open(id);
  // }

  // closeModal(id: string) {
  //   this.modalService.close(id);
  // }
}
