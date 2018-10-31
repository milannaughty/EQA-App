import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService, SkillSetsService, EmailService } from '../_services/index';
import { SkillSets } from '../_models/SkillSets';
import { DatePipe } from '@angular/common';
import { appConfig, adminConfig } from '../app.config';
import { CommonUtil } from '../app.util';

@Component({
    moduleId: module.id,
    selector: 'app-register-component',
    templateUrl: 'register.component.html',
    styleUrls: ['./register-component.css']
})

export class RegisterComponent {
    AdminActiveTab: any;
    @Output() messageEvent = new EventEmitter<any>();
    @Input() currentRequestData: any;
    qaSkillList: any;
    model: any = {};
    loading = false;
    panelTypeList: any;
    dropdownSettings = {};
    skillList: any;
    constructor(private userService: UserService,
        private skillSetsService: SkillSetsService,
        private datePipe: DatePipe,
        private emailService: EmailService) { }

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
        //debugger;
        this.loading = true;
        this.model.isPanel = true;
        this.model.AddedBy = { AdminUser: this.currentRequestData.currentUser.username };
        this.model.AddedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
        //TODO : Autogenerate Password
        this.model.password = 'nihilent@123';
        this.userService.create(this.model).subscribe(
            data => {
                //debugger;

                /**mail sending starts */
                if (this.model.isPanel) {//for panel
                    var toPersonMailId = this.model.username;
                    var initialPassword = appConfig.initialPassword;
                    var panelType = this.model.panelType;

                    var toPersonName = toPersonMailId.substring(0, toPersonMailId.indexOf('.', 0)).charAt(0).toUpperCase()
                        + toPersonMailId.substring(0, toPersonMailId.indexOf('.', 0)).slice(1);


                    var mailSubject = "Assigned as " + panelType + " Panel for IQA Process";

                    var mailObject = {
                        "fromPersonName": appConfig.fromPersonName,
                        "fromPersonMailId": appConfig.fromPersonMailId,
                        "toPersonName": toPersonName,
                        "toPersonMailId": toPersonMailId,
                        "ccPersonList": "",
                        "mailSubject": mailSubject,
                        "mailContent": "",
                        "initialPassword": initialPassword,
                        "panelType": panelType,
                    };

                    this.emailService.sendInitialMailToPanel(mailObject).subscribe(
                        success => {
                            this.loading = false;
                            CommonUtil.ShowSuccessAlert("Panel Created Successfully, mail sent to " + toPersonMailId);
                            //debugger;
                            this.ShowRequestDetails();
                        }, err => {
                            this.loading = false;
                            CommonUtil.ShowInfoAlert("Success", "Panel Created Successfully, erroe while sendign mail to " + toPersonMailId);
                        }
                    );

                } else {//for team
                }
                /**mail sending ends */
            },
            error => {
                //this.alertService.error(error.error);
                console.log("Error while adding new panel with " + this.model.username);
                CommonUtil.ShowErrorAlert("Error while adding new Panel" + error.error);
                this.loading = false;
            });
    }
    clear() {
        this.model.FName = this.model.LName = this.model.username = '';
        this.model.skillList = this.model.qaSkillList = null;
    }
    ShowRequestDetails() {
        console.log('Redirecting from request list to request detail view');
        //data["CurrentActionName"] = this.currentRequestData["CurrentActionName"];
        this.messageEvent.emit({ ActivateTab: adminConfig.ActionList.PanelList });
    }
}
