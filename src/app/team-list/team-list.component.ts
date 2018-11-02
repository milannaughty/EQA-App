import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from '../_services/index';
import { EmailManager, CommonUtil } from '../app.util';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  allTeam: any;
  loading: boolean;
  Name: any;
  PM: any;
  POC: any;
  DAM: any;
  Area: any;
  AddedBy: any;
  obsoluteFlag: boolean = false;
  isMakeActive: boolean = false;
  isAdminUser: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    debugger;
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.isAdminUser = this.currentUser.isAdmin;
    this.getAllTeamList();
  }

  getAllTeamList() {
    this.loading = true;
    this.userService.getAllUsersByRole("team").subscribe(
      result => {
        console.log(result);
        var activeTeamList = result.filter(x => !x["isDeleted"]);

        this.allTeam = activeTeamList.map(x => {
          if (x["AddedBy"])
            x["AddedBy"].AdminUser = EmailManager.GetUserNameFromCommaSepratedEmailIds(x["AddedBy"].AdminUser);
          if (x["POCEmail"])
            x["POCEmail"] = EmailManager.GetUserNameFromCommaSepratedEmailIds(x["POCEmail"]);
          if (x["DAMEmail"])
            x["DAMEmail"] = EmailManager.GetUserNameFromCommaSepratedEmailIds(x["DAMEmail"]);
          if (x["PMEmail"])
            x["PMEmail"] = EmailManager.GetUserNameFromCommaSepratedEmailIds(x["PMEmail"]);


          //debugger;
          x["isObsolute"] = x["obsolute"] == true
          return x;
        });
        this.loading = false;
        console.log(this.allTeam.obsolute);
      },
      err => {
        console.log("error : " + err);
      });
  }
  UpdateTeamStatus(id, isObsolute) {
    var set = {
      "obsolute": isObsolute,
      "teamId": id
    };
    this.userService.UpdateTeamStatus(set).subscribe(
      result => {
        this.loading = true;
        //debugger;
        console.log(result);
        CommonUtil.ShowSuccessAlert("Team Updated Successfully.");
        this.loading = false;
        this.getAllTeamList();
      },
      error => {
        //debugger;
        this.loading = true;
        CommonUtil.ShowErrorAlert(error.error);
        this.loading = false;
      });
  }
  deleteTeamDetails(id) {
    //debugger;
    var set = {
      "isDeleted": true,
      "teamId": id
    };
    this.userService.teamSoftDelete(set).subscribe(
      result => {
        //debugger;
        this.loading = true;
        CommonUtil.ShowSuccessAlert("Team Deleted Successfully.");
        this.loading = false;
        this.getAllTeamList();
      },
      error => {
        this.loading = true;
        CommonUtil.ShowErrorAlert(error.error);
        this.loading = false;
      });
  }
}
