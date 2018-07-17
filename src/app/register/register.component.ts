import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService, SkillSetsService } from '../_services/index';
import { SkillSets } from '../_models/SkillSets';
// import { SkillSetsService} from '../_services/skillSets.service';
// import { SkillSets } from '../_models/SkillSets';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    
    qaSkillList: any;
    model: any = {};
    loading = false;
    roleList: any;
    panelTypeList: any;
    selectedSkills: number[];
    dropdownSettings = {};
    skillList: any;
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private skillSetsService: SkillSetsService) { }

    ngOnInit() {
        debugger;
        this.model.roleId = 1;
        this.roleList = [
            {
                "Id": 1,
                "Name": "Team"
            },
            {
                "Id": 2,
                "Name": "Panel"
            }]
            this.panelTypeList = [
                {
                    "Id": 'Dev',
                    "Name": "Dev"
                },
                {
                    "Id": 'QA',
                    "Name": "QA"
                }]
        
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
            enableSearch:true,
            text: "Select Skillsets",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            minSelectionLimit:1 ,
            primaryKey: "_id",
            labelKey: "skillName"
        };
        
    }

    onDevSkillSelect(recievedItem){
        debugger;
        console.log("dev skill set selected "+recievedItem);
    }

    register() {
        debugger;
        this.loading = true;
        this.model.isPanel = this.model.roleId == 2;//2 is used for Panel registration, 1 is for Team
        debugger;
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error.error);
                this.loading = false;
            });
    }
}
