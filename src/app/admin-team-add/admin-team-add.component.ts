import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UserService, EmailService, AreaServices } from '../_services/index';
import { SkillSets } from '../_models/SkillSets';
import { DatePipe } from '@angular/common';
import { NospacePipe } from '../nospace.pipe';
import { appConfig } from '../app.config';
import { CommonUtil, EmailManager } from '../app.util';

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
    private emailService: EmailService,
    private areaService: AreaServices) { }

  ngOnInit() {

    this.areaService.getAllArea().subscribe(res => {
      debugger;
      this.areaList = res;
      this.model.area = this.areaList[0];
    }, err => {

    });
    //[{ 'Id': 'EBS', 'Name': 'EBS' }, { 'Id': 'DMG', 'Name': 'DMG' }];

  }


  register() {
    debugger;
    this.loading = true;
    this.model.isPanel = false;
    this.model.AddedBy = { AdminUser: this.currentRequestData.currentUser.username };
    this.model.AddedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    this.model.area = { _id: this.model.area._id, areaName: this.model.area.areaName }
    //TODO : Autogenerate Password
    this.model.password = appConfig.initialPassword;
    this.model.username = new NospacePipe().transform(this.model.teamName.toLowerCase());
    this.userService.create(this.model).subscribe(
      data => {
        var mailObject = {
          "toPersonMailId": this.model.POCEmail,
          "ccPersonList": EmailManager.GetCommaSepratedEmailIDs([this.model.DAMEmail, this.model.PMEmail]),
          "mailSubject": EmailManager.GetTeamAddedSubjectLine(this.model.teamName),
          "initialPassword": this.model.password,
          "teamName": this.model.teamName,
          "POCEmail": this.model.POCEmail,
          "username": this.model.username
        };

        //this.emailService.sendInitialMailToTeam(mailObject).subscribe(
        this.emailService.SendEmail(EmailManager.EmailAction.TEAM_ADDED, mailObject).subscribe(
          success => {
            this.loading = false;
            this.clearTeamForm();
            CommonUtil.ShowSuccessAlert("Registration succussfull, mail sent to team POC,PM & DAM");
            console.log("mail sent to admin with rejection details");
          }, err => {
            this.loading = false;
            console.log("Error while sending mail to admin with rejection details");
            CommonUtil.ShowErrorAlert("Registration succussfull, but error occured while sending mail to team POC,PM & DAM");
          }
        );
      },
      error => {
        CommonUtil.ShowErrorAlert(error.error);
        this.loading = false;
      });
  }

  clearTeamForm() {
    this.model.teamName = this.model.PMEmail = this.model.DAMEmail = this.model.POCEmail = this.model.username = "";
  }

}
