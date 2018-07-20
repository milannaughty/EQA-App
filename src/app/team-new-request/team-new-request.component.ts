import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService, SkillSetsService } from '../_services/index';
import { SkillSets } from '../_models';

@Component({
  selector: 'app-team-new-request',
  templateUrl: './team-new-request.component.html',
  styleUrls: ['./team-new-request.component.css']
})
export class TeamNewRequestComponent implements OnInit {
  loading = false;
  model: any = {};
  ActiveTabs: any = 'InitiateEQARequest';
  @Output() messageEvent = new EventEmitter<any>();
  selectedSkills: number[];
  dropdownSettings = {};
  skillList: any;
  qaSkillList:any;
  public deliveryDate: any = { date: new Date() };
  public expectedIQADate: any = { date: new Date() };
  constructor(
    private router: Router,
    private requestService: RequestService,
    private alertService: AlertService,
    private skillSetsService: SkillSetsService
  ) { }

  ngOnInit() {

    this.skillSetsService.getSkillSetsByType("Dev").subscribe(
      devSkills =>{
           this.skillList=(devSkills as SkillSets[]).map(x=>({id:x["_id"],itemName:x["skillName"]}));
           this.skillList=this.skillList.sort((x, y) => x.itemName.localeCompare(y.itemName));
      })
   this.skillSetsService.getSkillSetsByType("Qa").subscribe(
      qaSkillSet =>{
           this.qaSkillList=(qaSkillSet as SkillSets[]).map(x=>({id:x["_id"],itemName:x["skillName"]}));
           this.qaSkillList=this.qaSkillList.sort((x, y) => x.itemName.localeCompare(y.itemName));
      })

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Skillset",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true
    };
  }


  
  createRequest() {
    debugger;
    this.loading = true;
    this.model.isPanel = this.model.roleId == 2;//2 is used for Panel registration, 1 is for Team
    debugger;
    var currentUser = sessionStorage.getItem('currentUser');
    debugger;
    var cUser=JSON.parse(currentUser);
    this.model.status="New";
    this.model.creationDate= new Date();
    this.model.initiatedBy = {ID:JSON.parse(currentUser)._id,TeamName:JSON.parse(currentUser).teamName}
    this.requestService.create(this.model)
      .subscribe(
      data => {
        this.alertService.success('Registration successful', true);
        this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });

      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

}
