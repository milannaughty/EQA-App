import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UserService, EmailService } from '../_services/index';
import { DatePipe } from '@angular/common';
import { appConfig, adminConfig } from '../app.config';
import { CommonUtil,EmailManager } from '../app.util';
import swal from 'sweetalert2';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  AdminActiveTab: any;
  @Output() messageEvent = new EventEmitter<any>();
  @Input() currentUser: any;
  model: any = {};
  loading = false;
  constructor(private userService: UserService,
    private datePipe: DatePipe,
    private emailService: EmailService) { }

  ngOnInit() {
  }
  savefeedback() {
    this.loading = true;
    this.model.AddedBy = this.currentUser.username;
    this.model.AddedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    this.userService.submitfeedback(this.model).subscribe(
      data => {
          this.loading=false;
          //sendMailToAdminAftersubmitingfeedback
                /**mail sending starts */
                 var toPersonMailId =JSON.parse(sessionStorage.getItem('adminList')).emailIDs;
                  var fromPersonMailId= this.currentUser.username;
                    var emailSender= EmailManager.GetUserNameFromCommaSepratedEmailIds(this.currentUser.username);
                  var toPersonName = "";

                  var mailSubject = "Feedback for improve IQA Management system. ";

                  var mailObject = {
                      "fromPersonName": appConfig.fromPersonName,
                      "fromPersonMailId": fromPersonMailId,
                      "toPersonName": toPersonName,
                      "toPersonMailId": toPersonMailId,
                      "ccPersonList": "",
                      "mailSubject": mailSubject,
                      "mailContent": "",
                      "feedback":this.model.feedback,
                      "emailSender": emailSender,
                  };

                  this.emailService.sendMailToAdminAftersubmitingfeedback(mailObject).subscribe(
                      success => {
                          this.loading = false;
                          CommonUtil.ShowSuccessAlert("Feedback submited Successfully, mail sent to " + toPersonMailId);
                      }, err => {
                          this.loading = false;
                          CommonUtil.ShowInfoAlert("Success", "Feedback submited Successfully, error while sendign mail to " + toPersonMailId);
                      }
                  );
              /**mail sending ends */

          this.model.feedback="";

      },
      error => {
        console.log("Error while submiting feedback with " + this.model.username);
        CommonUtil.ShowErrorAlert("Error while submiting feedback" + error.error);
        this.model.feedback="";
        this.loading = false;
      });
  }

    Clear(){
      this.model.feedback="";
    }

  ErrorAlert(error) {
    swal({
      type: 'error',
      title: error,
    })
  }
  ShowSuccessAlert(msg) {
    swal('success', msg, 'success')
  }

}
