import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig } from '../app.config';
import { EmailService } from "../_services/mail.service";
import { AlertService } from '../_services/alert.service';

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

  constructor(private userService: UserService, 
              private requestService: RequestService,
              private alertService: AlertService,
              private emailService : EmailService) { }

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
    this.messageEvent.emit({ ActivateTab: 'HOME' });
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
    console.log('In assignSelectedUsers start');
    debugger;
    var testObj = new Array('1', '2');
    // this.requestService.sendMail(testObj).subscribe(
    //   res => {
    //     console.log('Updated requested completed.');
    //     this.ShowRequestList()
    //   },
    //   err => {
    //     console.log('Updated requested completed with error.');
    //     console.log(err)
    //     this.ShowRequestList()
    //   }
    // );
    var requestDto = {
      "_id": this.currentRequestData._id,
      "status": "PanelAssigned"
    };

    if (this.model.devSkillSetPanel)
      requestDto["assignedDevPanelList"] = this.model.devSkillSetPanel;
    if (this.model.qaSkillSetPanel)
      requestDto["assignedQAPanelList"] = this.model.qaSkillSetPanel;

    this.requestService.updateRequest(requestDto).subscribe(
      res => {
        debugger;
        console.log('Updated requested completed.');
        console.log('mail sending function starts here for Assigning QA and Dev to Request By admin');
        this.currentRequestData;
        var ccPersonList = (this.currentRequestData.initiatedBy.DAMEmail ? this.currentRequestData.initiatedBy.DAMEmail + ',' : '') 
                          + (this.currentRequestData.initiatedBy.PMEmail ? this.currentRequestData.initiatedBy.PMEmail + ',' : '')
                          + (this.currentRequestData.initiatedBy.POCEmail ? this.currentRequestData.initiatedBy.POCEmail : '');
            if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
              ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
            }
        var toPersonList ="";
        toPersonList += requestDto["assignedDevPanelList"].map(x => x.itemName).join(",");
        toPersonList +=",";
        toPersonList += requestDto["assignedQAPanelList"].map(x => x.itemName).join(",");

        var toPersonNames="";

        toPersonNames+= requestDto["assignedDevPanelList"].map(
                 x => x.itemName.substring(0,x.itemName.indexOf('.',0)).charAt(0).toUpperCase() 
                    + x.itemName.substring(0,x.itemName.indexOf('.',0)).slice(1)
                  ).join(', ');    
        
        toPersonNames+=", ";          
        toPersonNames+= requestDto["assignedQAPanelList"].map(
                    x => x.itemName.substring(0,x.itemName.indexOf('.',0)).charAt(0).toUpperCase() 
                       + x.itemName.substring(0,x.itemName.indexOf('.',0)).slice(1)
                     ).join(', ');        
        var teamName=this.currentRequestData.initiatedBy.TeamName;                      
        
        var mailSubject = "Panels are assigned for IQA Request Sprint "+this.currentRequestData.name;
        var mailObject = {
          "fromPersonName": appConfig.fromPersonName,
          "fromPersonMailId": appConfig.fromPersonMailId,
          "toPersonName": toPersonNames,
          "toPersonMailId": toPersonList,
          "ccPersonList": ccPersonList,
          "mailSubject": mailSubject,
          "mailContent": "",
          "teamName": teamName
        };
        
        this.emailService.sendMailToPanelsAfterAssigningPanelToIQARequestByAdmin(mailObject)
        .subscribe(result => {
          debugger;
          this.alertService.success('Mail sent to selected panel list', true);
          }, error => {
          debugger;
          this.alertService.error('Error while sending mail to selected panels', true);
         });
        console.log('mail sending function ends here for Assigning QA and Dev to Request By admin');
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
