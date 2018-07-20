import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, UserService, SkillSetsService } from '../_services/index';
import { SkillSets } from '../_models/SkillSets';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-register-component',
    templateUrl: 'register.component.html',
    styleUrls: ['./register-component.css']
})

export class RegisterComponent {
    @Input() currentRequestData: any;
    qaSkillList: any;
    model: any = {};
    loading = false;
    panelTypeList: any;
    dropdownSettings = {};
    skillList: any;
    constructor(private router: Router, private userService: UserService, 
        private alertService: AlertService, private skillSetsService: SkillSetsService,
    private datePipe : DatePipe) { }

    ngOnInit() {
        this.panelTypeList = [{ "Id": 'Dev', "Name": "Dev" }, { "Id": 'QA', "Name": "QA" }];
        this.dropdownSettings = { singleSelection: false, enableSearch: true, text: "Select Skillsets", selectAllText: 'Select All', unSelectAllText: 'UnSelect All', enableSearchFilter: true, minSelectionLimit: 1, primaryKey: "_id", labelKey: "skillName" };
        this.skillSetsService.getSkillSetsByType("Dev").subscribe(devSkills => { this.skillList = this.getFormattedSkillSet(devSkills); })
        this.skillSetsService.getSkillSetsByType("Qa").subscribe(qaSkillSet => { this.qaSkillList = this.getFormattedSkillSet(qaSkillSet); })
    }

    getFormattedSkillSet(skillSet: any[]) {
        var t = (skillSet as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
        t = t.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
        return t;
    }

    register() {
        this.loading = true;
        this.model.isPanel = true;
        this.model.AddedBy = { AdminUser: this.currentRequestData.currentUser.username };
        this.model.AddedOn = this.datePipe.transform(new Date(),'dd-MMM-yyyy HH:MM:SS');
        //TODO : Autogenerate Password
        this.model.password = 'nihilent@123';
        this.userService.create(this.model).subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                //this.clear();
                this.loading = false;
            },
            error => {
                this.alertService.error(error.error);
                this.loading = false;
            });
    }
    clear(){
        this.model.FName =this.model.LName = this.model.username = '';
        this.model.skillList = this.model.qaSkillList =null;
    }
}
