import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { AlertService, EmailService } from '../_services';
import { appConfig } from '../app.config';

@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.css']
})
export class ResetUserPasswordComponent implements OnInit {
  model: any = {};
  showOk: boolean;
  showNotOk: boolean;
  userNameInputFlag: boolean;
  constructor(private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private emailService: EmailService) { }

  ngOnInit() {
    debugger;
    this.showOk = false;
    this.showNotOk = false;
    if (sessionStorage.getItem('currentUser')) {
      this.userNameInputFlag = false;
    } else {
      this.userNameInputFlag = true;
    }

  }


  forgotPassword() {
    
      var password = Math.random().toString(36).slice(-8);
        /**Generating password starts */
        var user: any;
        var toPersonNameEmailId: string;
        this.userService.getUserByUserName(this.model.username).subscribe(result => {

          user = result;
          var ccPersonList;
          if (user.isPanel != undefined && user.isPanel) {
            toPersonNameEmailId = user.username;
          } else {
            toPersonNameEmailId = user.POCEmail;
            ccPersonList = (user.DAMEmail ? user.DAMEmail + ',' : '')
              + (user.PMEmail ? user.PMEmail + ',' : '');
            if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
              ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
            }
          }
          var mailSubject = "Password reseted succussfully";
          var resetObject = {
            "username": this.model.username,
            "newPassword": password
          };

          var mailObject = {
            "fromPersonName": appConfig.fromPersonName,
            "fromPersonMailId": appConfig.fromPersonMailId,
            "toPersonMailId": toPersonNameEmailId,
            "ccPersonList": ccPersonList,
            "mailSubject": mailSubject,
            "mailContent": "",
            "password": password,
            "username": this.model.username
          };

          this.userService.forgotPassword(resetObject).subscribe(
            success => {
              console.log("password reseted successfully." + success);

              this.emailService.sendNewlyGeneratedPasswordToUserMailTo(mailObject).subscribe(
                res => {
                  console.log("mail sent successfully");
                }, err => {
                  console.log("Error while sending mail");
                }
              );

              this.alertService.success("Password reseted successfully, please login with new password.");
              this.router.navigate(['/login']);
            }, error => {
              console.log("Error while reseting password" + error);
            });

        }, err => {
          console.log("Error while fetching user from DB" + err);
        });
        /**Generating password ends */

  }

  resetPassword() {
    debugger;
    var currentUser = sessionStorage.getItem('currentUser');
    var cUser = JSON.parse(currentUser);

    var resetObject = {
      "username": cUser.username,
      "oldPassword": this.model.oldPassword,
      "newPassword": this.model.newPassword
    };

    this.userService.resetUserPassword(resetObject).subscribe(
      success => {
        console.log("password reseted successfully.");
        this.alertService.success("Password reseted successfully, please login with new password.");
        this.router.navigate(['/login']);
      }, error => {
        console.log("Error while reseting password" + error);
      });



  }

  onChangeNewPassword(recievedValue) {
    //debugger;
    console.log("1");
  }

  onChangeConfirmNewPassword(recievedValue) {
    console.log("at begining of onChangeConfirmNewPassword method");
    //debugger;
    this.showOk = false;
    this.showNotOk = false;
    this.model;
    if (this.model.newPassword != this.model.confirmNewPassword)
      this.showNotOk = true;
    else
      this.showOk = true;
    console.log("2" + recievedValue);
    console.log("at end of onChangeConfirmNewPassword method");
  }
}
