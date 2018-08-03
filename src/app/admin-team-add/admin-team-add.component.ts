import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AlertService, UserService, EmailService } from '../_services/index';
import { SkillSets } from '../_models/SkillSets';
import { DatePipe } from '@angular/common';
import { NospacePipe } from '../nospace.pipe';
import { appConfig } from '../app.config';
import { CommonUtil } from '../app.util';

@Component({
  selector: 'app-admin-team-add',
  templateUrl: './admin-team-add.component.html',
  styleUrls: ['./admin-team-add.component.css']
})
export class AdminTeamAddComponent implements OnInit {
  @Input() currentRequestData: any;
  model: any = {};
  loading = false;
  areaList: any;
  constructor(private userService: UserService,
              private datePipe: DatePipe,
              private alertService: AlertService,
              private emailService: EmailService) { }

  ngOnInit() {
    this.areaList = [{ 'Id': 'EBS', 'Name': 'EBS' }, { 'Id': 'DMG', 'Name': 'DMG' }];
    this.model.area = this.areaList[0].Name;
  }


  register() {
    this.loading = true;
    this.model.isPanel = false;
    this.model.AddedBy = { AdminUser: this.currentRequestData.currentUser.username };
    this.model.AddedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    //TODO : Autogenerate Password
    this.model.password = appConfig.initialPassword;
    this.model.username = new NospacePipe().transform(this.model.teamName.toLowerCase());
    this.userService.create(this.model).subscribe(
      data => {
        //debugger;
        //this.alertService.success('Registration successful', true);
        //this.clear();
        this.loading = false;
        debugger;
        var toPersonMailId=this.model.POCEmail;
        var initialPassword=appConfig.initialPassword;

  
        var ccPersonList = (this.model.DAMEmail ? this.model.DAMEmail + ',' : '') 
                       + (this.model.PMEmail ? this.model.PMEmail + ',' : '');
           if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
              ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
          }
        
        var mailSubject="Team "+this.model.teamName+" registered as Team for IQA Process"; 

              var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonMailId": toPersonMailId,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "initialPassword" : initialPassword,
              "teamName" : this.model.teamName,
              "POCEmail":this.model.POCEmail,
              "username":this.model.username
              };

              this.emailService.sendInitialMailToTeam(mailObject).subscribe(
                success =>{
                //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                CommonUtil.ShowSuccessAlert("Registration succussfull, mail sent to team POC,PM & DAM");
                console.log("mail sent to admin with rejection details");
                },err =>{
                //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("Error while sending mail to admin with rejection details");
                CommonUtil.ShowErrorAlert("Registration succussfull, but error occured while sending mail to team POC,PM & DAM");
              }
                );
      },
      error => {
        CommonUtil.ShowErrorAlert(error.error);
        //this.alertService.error(error.error);
        this.loading = false;
      });
  }

}
