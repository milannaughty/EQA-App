import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";

@Component({
  moduleId: module.id,
  selector: 'app-admin-team-request-details',
  templateUrl: './admin-team-request-details.component.html',
  styleUrls: ['./admin-team-request-details.component.css']
})
export class AdminTeamRequestDetailsComponent implements OnInit {
  devDropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  qaDropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  isSkillLoaded: boolean = false;

  constructor(private userService: UserService, private requestService: RequestService) {

  }

  ngOnInit() {
    /* this.userBySkills = this.userService.GetPanelBySkills(this.currentRequestData.skillSet);
    console.log("users : "+this.userBySkills);
    */
    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    console.log(this.isSkillLoaded)
    this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));


      this.devDropdownSettings = {
        singleSelection: false,
        text: "Select Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };

      this.qaDropdownSettings = {
        singleSelection: false,
        text: "Select Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };
    });
  }
  ShowRequestList() {
    debugger;
    this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });
  }

  //  getPanelUserBySkills(){
  //    debugger;
  //     this.userService.getPanelBySkills(this.currentRequestData.skillSet).subscribe(result => {
  //       this.userBySkills = result;
  //       // this.loading = false;
  //       // this.NewRequest = result;
  //     });
  //     //  this.userBySkills = this.userService.GetPanelBySkills(this.currentRequestData.skillSet);
  //     //  return this.userBySkills;
  //  }  

  assignSelectedUsers() {
    debugger;
    console.log('in assignSelectedUsers start');
    var testObj = new Array('1','2');
    this.requestService.sendMail(testObj).subscribe(
      res => {
        debugger;
        console.log('Updated requested completed.');
        this.ShowRequestList()
      },
      err => {
        console.log('Updated requested completed with error.');
        console.log(err)
        this.ShowRequestList()
      }
    );
    console.log('after');
    // var selectedQaSkills = new Array();
    // var selectedDevSkills = new Array();
    // if (this.model.devSkillSetPanel != undefined && this.model.devSkillSetPanel.length != 0) {
    //   //update request as assigned to

    //   this.model.devSkillSetPanel.forEach(
    //     function (value, key) {
    //       debugger;
    //       console.log(key);
    //       console.log(value);
    //       selectedDevSkills.push(value);
    //     }
    //   );
    // }
    // if (this.model.qaSkillSetPanel != undefined && this.model.qaSkillSetPanel.length != 0) {
    //   //update request as assigned to
    //   this.model.qaSkillSetPanel.forEach(
    //     function (value, key) {
    //       debugger;
    //       console.log(key);
    //       console.log(value);
    //       selectedQaSkills.push(value);
    //     }
    //   );
    // }
    var requestDto = {
      "_id": this.currentRequestData._id,
      "assidnedDevPanel": this.model.devSkillSetPanel,
      "assidnedQaPanel": this.model.qaSkillSetPanel,
      "status": "PanelAssigned"
    };
    this.requestService.updateRequest(requestDto).subscribe(
      res => {
        debugger;
        console.log('Updated requested completed.');
        this.ShowRequestList()
      },
      err => {
        console.log('Updated requested completed with error.');
        console.log(err)
        this.ShowRequestList()
      }
    );
  }


}
