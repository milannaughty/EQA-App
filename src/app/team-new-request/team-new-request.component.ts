import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService, SkillSetsService, UserService } from '../_services/index';
import { SkillSets } from '../_models';
import { EmailService } from '../_services/mail.service';
import { appConfig } from '../app.config';
@Component({
  selector: 'app-team-new-request',
  templateUrl: './team-new-request.component.html',
  styleUrls: ['./team-new-request.component.css']
})
export class TeamNewRequestComponent implements OnInit {
  dropdownSettingsQA: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  dropdownSettingsDEV: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  loading = false;
  model: any = {};
  ActiveTabs: any = 'InitiateEQARequest';
  @Output() messageEvent = new EventEmitter<any>();
  selectedSkills: number[];
  dropdownSettings = {};
  skillList: any;
  qaSkillList: any;
  public deliveryDate: any = { date: new Date() };
  public expectedIQADate: any = { date: new Date() };
  constructor(
    private router: Router,
    private requestService: RequestService,
    private alertService: AlertService,
    private skillSetsService: SkillSetsService,
    private emailService: EmailService,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.skillSetsService.getSkillSetsByType("Dev").subscribe(
      devSkills => {
        this.skillList = (devSkills as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
        this.skillList = this.skillList.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
      })
    this.skillSetsService.getSkillSetsByType("Qa").subscribe(
      qaSkillSet => {
        this.qaSkillList = (qaSkillSet as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
        this.qaSkillList = this.qaSkillList.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
      })

    this.dropdownSettingsDEV = {
      singleSelection: false,
      text: "Select Dev Skillset",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true
    };
    this.dropdownSettingsQA = {
      singleSelection: false,
      text: "Select QA Skillset",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true
    };
  }



  createRequest() {
    this.loading = true;
    this.model.isPanel = this.model.roleId == 2;//2 is used for Panel registration, 1 is for Team
    var currentUser = sessionStorage.getItem('currentUser');
    var cUser = JSON.parse(currentUser);
    this.model.status = "New";
    this.model.creationDate = new Date();
    this.model.initiatedBy = { ID: JSON.parse(currentUser)._id, 
                              TeamName: JSON.parse(currentUser).teamName,
                              PMEmail:JSON.parse(currentUser).PMEmail,
                              POCEmail:JSON.parse(currentUser).POCEmail,
                              DAMEmail:JSON.parse(currentUser).DAMEmail }
    this.requestService.create(this.model)
      .subscribe(
        data => {
          debugger;
          /**sTART */
          console.log('Request saved')
          var currentUser = sessionStorage.getItem('currentUser');
          var cUser = JSON.parse(currentUser);
          var toPersonArr: any;

          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            debugger;
            if (adminList instanceof Array)
              toPersonArr = adminList.map(x => x.username).join(',');
            else
              toPersonArr = adminList["username"];
            var ccPersonList = (cUser.DAMEmail ? cUser.DAMEmail + ',' : '') + (cUser.PMEmail ? cUser.PMEmail + ',' : '') + (cUser.POCEmail ? cUser.POCEmail : '');
            if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
              ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
            }

            var mailSubject = "[Test Mail] : " + cUser.teamName + " has initiated IQA request for Sprint " + this.model.name;
            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": "Admin",
              "toPersonMailId": toPersonArr,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "teamName": cUser.teamName
            };

            this.emailService.sendMailToAdminAfterIQARequestInitiatedByTeam(mailObject)
              .subscribe(result => {
                debugger;
                this.alertService.success('IQA Request initiated successfully, Email send to PM,DAM & POC.', true);
                this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });
              }, error => {
                debugger;
                this.alertService.success('IQA Request initiated successfully, unable to send email', true);
                this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });
              });
          }, error => {
            this.alertService.success('IQA Request initiated successfully, unable to send email', true);
            this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });
          });
          //END 

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }



}


