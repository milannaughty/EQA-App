import { Component, OnInit } from '@angular/core';
import { UserService} from '../_services/user.service';
import { Router } from '@angular/router';
import { AlertService } from '../_services';

@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.css']
})
export class ResetUserPasswordComponent implements OnInit {
  model: any = {};
  showOk:boolean;
  showNotOk:boolean;
  userNameInputFlag:boolean;
  constructor(private userService:UserService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.showOk=false;
    this.showNotOk=false;
    if(sessionStorage.getItem('currentUser'))
      {
        this.userNameInputFlag=false;
      }else{
        this.userNameInputFlag=true;
      }
      
  }

  resetPassword(){
    debugger;
    var currentUser = sessionStorage.getItem('currentUser');
    var cUser = JSON.parse(currentUser);

    var resetObject={
                      "username":cUser.username,
                      "oldPassword":this.model.oldPassword,
                      "newPassword":this.model.newPassword
                    };

    this.userService.resetUserPassword(resetObject).subscribe(
      success => {
          console.log("password reseted successfully.");
          this.alertService.success("Password reseted successfully, please login with new password.");
          this.router.navigate(['/login']);
      },error =>{
        console.log("Error while reseting password"+error);
      });



  }

  onChangeNewPassword(recievedValue){
    //debugger;
    console.log("1");
  }

  onChangeConfirmNewPassword(recievedValue){
    console.log("at begining of onChangeConfirmNewPassword method");
    //debugger;
    this.showOk=false;
    this.showNotOk=false;
        this.model;
    if(this.model.newPassword != this.model.confirmNewPassword)
      this.showNotOk=true;
    else
      this.showOk=true;  
    console.log("2"+recievedValue);
    console.log("at end of onChangeConfirmNewPassword method");
  }
}
