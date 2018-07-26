import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService, UserService, EmailService } from '../_services/index';
import { appConfig } from '../app.config';

@Component({
  selector: 'associate-new-request-list',
  templateUrl: './associate-new-request-list.component.html',
  styleUrls: ['./associate-new-request-list.component.css']
})
export class AssociateNewRequestListComponent implements OnInit {
  NewRequest: any;
  loading: boolean;
  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  constructor(private requestService: RequestService,
              private userService: UserService,
              private emailService: EmailService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  ClickAccept(data : any){
    var requestDto = {
      "requestId":data._id,
      "status": "InProgress"
    };
    this.requestService.updateStatusOfRequest(requestDto).subscribe(
      result => {
            debugger;
            this.loadNewRequestForAssociate();
            /** sending mail begins */

            var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '') 
                              + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '');
                  if (ccPersonList.lastIndexOf(',') != ccPersonList.length - 1) {
                    ccPersonList +=','; 
                    }
                     
                  var toPerssonList=data.initiatedBy.POCEmail ;    
                  var toPersonName=toPerssonList.substring(0,toPerssonList.indexOf('.',0)).charAt(0).toUpperCase() + toPerssonList.substring(0,toPerssonList.indexOf('.',0)).slice(1);
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
                        "toPersonMailId": toPerssonList,
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


            /** sending mail ends */
          },err => {
                console.log("Error while accepting IQA request ");
          });
      }  
  
  private ShowRequestDetails(data,showRemarkBox) {
    console.log(data);
    console.log('Redirecting from request list to request detail view');
    data["showRemark"] = showRemarkBox;
    data["panelType"] = this.currentUser.panelType;
    this.messageEvent.emit({ ActivateTab: 'Request Detail', data: data });
  }

  private loadNewRequestForAssociate() {
    this.loading = true;
    this.requestService.getAssociateNewRequest(this.currentUser._id).subscribe(result => {
    this.loading = false;
    this.NewRequest = result;
    });
  }

}
