import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService, SkillSetsService, UserService } from '../_services/index';
import { SkillSets } from '../_models';
import { EmailService } from '../_services/mail.service';
import { appConfig } from '../app.config';
import { CommonUtil } from '../app.util';
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
    this.model.skillSet = this.model.skillSet || [];
    this.model.qaSkillSet= this.model.qaSkillSet || [];
    this.model.initiatedBy = {
      ID: cUser._id,
      TeamName: cUser.teamName,
      PMEmail: cUser.PMEmail,
      POCEmail: cUser.POCEmail,
      DAMEmail: cUser.DAMEmail
    }
    this.requestService.create(this.model)
      .subscribe(
      data => {
        /**sTART */
        console.log('Request saved')
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

          var mailSubject = "IQA Team | " + cUser.teamName + " has initiated IQA request for Sprint " + this.model.name;
          var mailObject = {
            fromPersonName: appConfig.fromPersonName,
            fromPersonMailId: appConfig.fromPersonMailId,
            toPersonName: "Admin",
            toPersonMailId: toPersonArr,
            ccPersonList: ccPersonList,
            mailSubject: mailSubject,
            mailContent: "",
            teamName: cUser.teamName
          };

          this.emailService.sendMailToAdminAfterIQARequestInitiatedByTeam(mailObject)
            .subscribe(result => {
              CommonUtil.ShowSuccessAlert('IQA Request initiated successfully, Email send to PM,DAM & POC.');
              this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });
            }, error => {
              CommonUtil.ShowSuccessAlert('IQA Request initiated successfully, unable to send email');
              this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });
            });
        }, error => {
          CommonUtil.ShowSuccessAlert('IQA Request initiated successfully, unable to send email');
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


