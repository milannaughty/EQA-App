import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig } from '../app.config';
import { EmailService } from '../_services/mail.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-associate-request-detail',
  templateUrl: './associate-request-detail.component.html',
  styleUrls: ['./associate-request-detail.component.css']
})
export class AssociateRequestDetailComponent implements OnInit {
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  isSkillLoaded: boolean = false;
  reasonText: string = '';
  statusList: any=[];
  ddlId: number;

  constructor(private userService: UserService,
              private requestService: RequestService,
              private emailService: EmailService,
              private alertService: AlertService) {

  }

  ngOnInit() {

    this.ShowRequestDetails();
    this.populateStatusDropdown();
   // this.reasonText = `${this.currentRequestData.currentUser.FName} ${this.currentRequestData.currentUser.LName} has rejected IQA request on ${Date.now() }`
  }
  
  onStatusChange(event) {
    this.currentRequestData.showRemark = this.model.selectedStatus == "Rejected";
    this.currentRequestData.showSaveButton = this.model.selectedStatus == "Completed" || this.model.selectedStatus == "Rejected" || this.model.selectedStatus == "InProgress";;
  }
  
  ShowRequestDetails() {
    console.log('In Request Detail Method')
    // this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
    //   this.isSkillLoaded = true
    //   var r = result as Object[];
    //   this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
    //   this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));

    // });

  }

  ShowRequestList() {
    this.messageEvent.emit({ ActivateTab: this.currentRequestData.prevActiveTab || 'HOME' });
  }

  OnSaveClick() {
    debugger;
    var set = {
      "status": this.model.selectedStatus,
      "rejectReason": this.reasonText,
      "requestId": this.currentRequestData._id
    };
    if (this.currentRequestData.panelType == 'Dev')
      set["assignedDevPanelList"] = null;
    if (this.currentRequestData.panelType == 'QA' || this.currentRequestData.panelType == 'Qa')
      set["assignedQAPanelList"] = null;

debugger;
    this.requestService.updateStatusOfRequest(set).subscribe(
      result => {
                this.ShowRequestList();
              debugger;  
        var data=this.currentRequestData;                
        if(set.status=="Rejected"){//code after rejection
          var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '') 
                        + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '')
                        + (data.initiatedBy.POCEmail ? data.initiatedBy.POCEmail : '');
          if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
            ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
          }
          var toPerssonList="";    
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
              debugger;
              if (adminList instanceof Array)
                toPerssonList = adminList.map(x => x.username).join(',');
              else
                toPerssonList = adminList["username"];
              var currentUser = sessionStorage.getItem('currentUser');
              var cUser = JSON.parse(currentUser);
              var mailSubject="IQA Request [Sprint Name :"+data.name+"] Rejected by Panel "+cUser.username; 
              
              
                var mailObject = {
                  "fromPersonName": appConfig.fromPersonName,
                  "fromPersonMailId": appConfig.fromPersonMailId,
                  "toPersonName": "Admin",
                  "toPersonMailId": toPerssonList,
                  "ccPersonList": ccPersonList,
                  "mailSubject": mailSubject,
                  "mailContent": "",
                  "sprintName" : data.name,
                  "panelName" : cUser.username,
                  "rejectReason" : set.rejectReason
                };

                this.emailService.sendMailToAdminsAfterIQARequestRejectedByPanel(mailObject).subscribe(
                  success =>{
                      //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                      console.log("mail sent to admin with rejection details");
                  },err =>{
                    //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                    console.log("Error while sending mail to admin with rejection details");
                  }
                );

              },err => {
                console.log("Error while sending mail to admin with rejection details : for fetching admin details");
              });
        }else if(set.status=="InProgress"){//code after acceptance

              var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '') 
                               + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '');
              if (ccPersonList.lastIndexOf(',') != ccPersonList.length - 1) {
                  ccPersonList +=','; 
                }
              
              var toPerssonListAcceptance=data.initiatedBy.POCEmail ; 
              var toPersonName=toPerssonListAcceptance.substring(0,toPerssonListAcceptance.indexOf('.',0)).charAt(0).toUpperCase() 
                             + toPerssonListAcceptance.substring(0,toPerssonListAcceptance.indexOf('.',0)).slice(1);   
              this.userService.getAllUsersByRole("admin").subscribe(adminList => {
              debugger;
              if (adminList instanceof Array)
                ccPersonList += adminList.map(x => x.username).join(',');
              else
                ccPersonList += adminList["username"];
              var currentUser = sessionStorage.getItem('currentUser');
              var cUser = JSON.parse(currentUser);

              var mailSubject="IQA Request [Sprint Name :"+data.name+"] Accepted by Panel "+cUser.FName+" "+cUser.LName; 

                var mailObject = {
                  "fromPersonName": appConfig.fromPersonName,
                  "fromPersonMailId": appConfig.fromPersonMailId,
                  "toPersonName": toPersonName,
                  "toPersonMailId": toPerssonListAcceptance,
                  "ccPersonList": ccPersonList,
                  "mailSubject": mailSubject,
                  "mailContent": "",
                  "sprintName" : data.name,
                  "panelName" : cUser.username,
                };

                this.emailService.sendMailToPOCAfterIQARequestAcceptedByPanel(mailObject).subscribe(
                  success =>{
                      //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                      console.log("mail sent to admin with rejection details");
                  },err =>{
                    //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                    console.log("Error while sending mail to admin with rejection details");
                  }
                );

              },err => {//error while fething admin role users
                console.log("Error while sending mail to admin with rejection details : for fetching admin details");
              });
        }//acceptance block ends here
        if(set.status=="Completed"){//if panel has completed IQA request
                var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '') 
                                 + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '');
                if (ccPersonList.lastIndexOf(',') != ccPersonList.length - 1) {
                 ccPersonList +=','; 
                }

                var toPerssonListAcceptance=data.initiatedBy.POCEmail ; 
                var toPersonName=toPerssonListAcceptance.substring(0,toPerssonListAcceptance.indexOf('.',0)).charAt(0).toUpperCase() 
                        + toPerssonListAcceptance.substring(0,toPerssonListAcceptance.indexOf('.',0)).slice(1);   
                this.userService.getAllUsersByRole("admin").subscribe(adminList => {
                debugger;
                if (adminList instanceof Array)
                ccPersonList += adminList.map(x => x.username).join(',');
                else
                ccPersonList += adminList["username"];
                var currentUser = sessionStorage.getItem('currentUser');
                var cUser = JSON.parse(currentUser);

                var mailSubject="IQA Request [Sprint Name :"+data.name+"] Accepted by Panel "+cUser.FName+" "+cUser.LName; 

                var mailObject = {
                "fromPersonName": appConfig.fromPersonName,
                "fromPersonMailId": appConfig.fromPersonMailId,
                "toPersonName": toPersonName,
                "toPersonMailId": toPerssonListAcceptance,
                "ccPersonList": ccPersonList,
                "mailSubject": mailSubject,
                "mailContent": "",
                "sprintName" : data.name,
                "panelName" : cUser.username,
                };

                this.emailService.sendMailToPOCAfterIQARequestCompletedByPanel(mailObject).subscribe(
                success =>{
                //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("mail sent to admin with rejection details");
                },err =>{
                //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("Error while sending mail to admin with rejection details");
                }
                );

                },err => {//error while fething admin role users
                console.log("Error while sending mail to admin with rejection details : for fetching admin details");
                });
        }//if panel has completed IQA request If block ends
                
      },err =>{
        this.alertService.error('Error while rejecting IQA Request ',true);
      });
  }

  populateStatusDropdown(){
    if (this.currentRequestData.status == 'PanelAssigned') {
      this.statusList.push({ "Id":"InProgress", "Name": "Accept" })
    }
    else if (this.currentRequestData.status == 'InProgress') {
      this.statusList.push( { "Id": "Completed", "Name": "Complete" })
    }
    this.statusList.push({ "Id": "Rejected", "Name": "Rejected" })
    this.model.selectedStatus = this.statusList[0].Name;
  }

}
