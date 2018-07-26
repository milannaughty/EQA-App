import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService, UserService, SkillSetsService } from '../_services/index';
import { SkillSets } from '../_models';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { HttpClient } from "@angular/common/http";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-admin-skill-set',
  templateUrl: './admin-skill-set.component.html',
  styleUrls: ['./admin-skill-set.component.css']
})
export class AdminSkillSetComponent implements OnInit {
  model: any = {};
  skillSets: any;
  skillTypeList: { "Id": string; "Name": string; }[];
  @Input() currentRequestData: any;
  @Input() CurrentUser: any;
  skillList: any;
  qaSkillList: any;
  clients: any[];
  dataTable: any;
  panelTypeList: any;
  dropdownSettings = {};
  loading = false;
  saveButtonCaption: string = 'Add Skill';
  skillMassage: any;
  isError: boolean;
  isAddSkill: true;
  showMessage: boolean;

  constructor(private skillSetsService: SkillSetsService, private http: HttpClient, private chRef: ChangeDetectorRef, private userService: UserService,
    private alertService: AlertService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.currentRequestData["CurrentUser"] = this.CurrentUser;
    this.getAllSkillOnLoad();
    this.skillTypeList = [
      {
        "Id": 'Dev',
        "Name": "Dev"
      },
      {
        "Id": 'QA',
        "Name": "QA"
      }]

    this.panelTypeList = [{ "Id": 'Dev', "Name": "Dev" }, { "Id": 'QA', "Name": "QA" }];
    this.dropdownSettings = { singleSelection: false, enableSearch: true, text: "Select Skillsets", selectAllText: 'Select All', unSelectAllText: 'UnSelect All', enableSearchFilter: true, minSelectionLimit: 1, primaryKey: "_id", labelKey: "skillName" };
    this.skillSetsService.getSkillSetsByType("Dev").subscribe(devSkills => { this.skillList = this.getFormattedSkillSet(devSkills); })
    this.skillSetsService.getSkillSetsByType("Qa").subscribe(qaSkillSet => { this.qaSkillList = this.getFormattedSkillSet(qaSkillSet); })
  
}

getAllSkillOnLoad(){
  this.skillSetsService.getAllSkillSets().subscribe(
    devSkills => {
      this.skillSets = (devSkills as SkillSets[]);
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable();
    }
  )
}
  getFormattedSkillSet(skillSet: any[]) {
    var t = (skillSet as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
    t = t.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
    return t;
  }
  addSkill() {
    this.model.createdBy = this.currentRequestData.currentUser.username;
    this.model.createdOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    if (this.saveButtonCaption == 'Add Skill') {
      this.skillSetsService.postNewSkillSet(this.model).subscribe(
        result => {
          this.saveButtonCaption = 'Add Skill';
          console.log(result);
          this.clear();
          this.isError = false;
          this.skillMassage = "Skill add successfully.";
          this.clear();
          debugger;
          this.SetMessageTimeOut();
        },
        error => {
          this.isError = true;
          this.skillMassage = error.error;
          this.SetMessageTimeOut();
        });
    } else if (this.saveButtonCaption == 'Update Changes') {
      var set = {
        "skillName": this.model.skillName,
        "type": this.model.type,
        "requestId": this.model._id,
        "modifiedBy": this.currentRequestData.currentUser.username,
        "modifiedOn": this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS')
      };
      this.skillSetsService.updateSkillSetObjectToDB(set).subscribe(
        result => {
          console.log(result);
          this.isError = false;
          this.skillMassage = "Skill updated successfully.";
          debugger;
          this.clear();
          this.SetMessageTimeOut();
          this.saveButtonCaption = 'Add Skill';
        },
        error => {
          this.isError = true;
          this.skillMassage = error.error;
          this.SetMessageTimeOut();
        });
    }
  }
  editSkillDetail(data) {
    console.log('Redirecting from request list to request detail view');
    this.model.skillName = data.skillName;
    this.model.type = data.type;
    this.model._id = data._id;
    this.saveButtonCaption = 'Update Changes';
  }
  deleteSkillDetail(data) {
    var set = {
      "requestId": data._id
    };
    this.skillSetsService.deleteSkillSet(data._id).subscribe(
      result => {
        console.log(result);
        this.isError = false;
        this.skillMassage = "Skill deleted successfully.";
        this.SetMessageTimeOut();
      },
      error => {
        this.isError = true;
        this.skillMassage = error.error;
        this.SetMessageTimeOut();
      });
  }
  skillClear(){
    debugger;
    this.clear();
  }
  clear() {
    this.model.skillName = '';
    this.model.type = null;
    this.saveButtonCaption = 'Add Skill';
  }
  SetMessageTimeOut() {
    this.showMessage = true;

    setTimeout(() => {    //<<<---    using ()=> syntax
      this.showMessage = false;
    }, 3000);
  }
}

