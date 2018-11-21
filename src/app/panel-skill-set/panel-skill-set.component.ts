import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { SkillSetsService, UserService } from '../_services';
import { ConstantString, CommonUtil, MessageManager } from '../app.util';
import { SkillSets } from '../_models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-panel-skill-set',
  templateUrl: './panel-skill-set.component.html',
  styleUrls: ['./panel-skill-set.component.css']
})
export class PanelSkillSetComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<any>();
  @Input() currentUser: any;
  model: any = {};
  tblloading: boolean;
  showAddNewTextBox: boolean;
  skillSets: any[] = [];
  remainingSkillList: { id: any; itemName: any; }[] = [];
  dropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  isDevPanel: boolean;
  constructor(private skillSetsService: SkillSetsService, private userService: UserService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.isDevPanel = this.currentUser.panelType == ConstantString.Dev;
    this.GetSkillSetsByPanel();
    //this.GetAllSkillSet();
  }

  GetSkillSetsByPanel() {
    this.tblloading = true;
    this.skillSetsService.GetSkillSetsByPanel(this.currentUser._id).subscribe(
      panelSkillSet => {
        panelSkillSet = panelSkillSet[0];
        this.skillSets = this.isDevPanel ? panelSkillSet["skillSet"] : panelSkillSet["qaSkillSet"];
        this.tblloading = false;
        this.GetAllSkillSet();
      }
    )
  }

  GetAllSkillSet() {

    this.skillSetsService.getSkillSetsByType(this.currentUser.panelType).subscribe(
      skill => {
        this.remainingSkillList = (skill as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
        this.remainingSkillList = this.remainingSkillList.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
        this.remainingSkillList = this.remainingSkillList.filter(skillItem => {
          if (!this.skillSets.some(item => item.id == skillItem.id))
            return skillItem;
        })
      })

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Skillset",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true
    };
  }

  OnAddNewClick() {
    this.showAddNewTextBox = true;
  }
  OnCancelClick() {
    this.showAddNewTextBox = false;
    this.model["skillSet"] = null;
    this.model.skillName = '';
  }
  OnSave() {
    if (this.showAddNewTextBox) {
      this.OnNewSkillSave();
    }
    else {
      //Panels current skill are in "skillSets" object
      //concat skill to existing skills
      if (!(this.model.skillSet && this.model.skillSet.length > 0)) {
        CommonUtil.ShowErrorAlert("No Skills selected");
        return;
      }
      CommonUtil.ShowLoading();
      this.FillSkillSet(this.model.skillSet);
      this.UpdateTheUserDetails();
    }
  }

  OnNewSkillSave() {
    if (!(this.model.skillName && this.model.skillName.trim())) {
      CommonUtil.ShowErrorAlert("Enter valid information");
      return;
    }
    //delete unnecessary object properties
    delete this.model.skillSet
    CommonUtil.ShowLoadingWithTitle("Adding new skill to master...");
    this.model.type = this.isDevPanel ? ConstantString.Dev : ConstantString.QA;
    this.model.createdBy = this.currentUser.username;
    this.model.createdOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    this.skillSetsService.postNewSkillSet(this.model).subscribe(
      result => {
        console.log(JSON.stringify(result))
        CommonUtil.ShowLoadingWithTitle("Updating skill list...");
        let insertedRecord = [{ id: result[0]._id, itemName: result[0].skillName }];
        this.FillSkillSet(insertedRecord);
        this.UpdateTheUserDetails();
      },
      error => {
        //console.log(JSON.stringify(error))
        CommonUtil.ShowErrorAlert(error.error);
      });
  }

  FillSkillSet(newSkillSet) {
    if (this.isDevPanel) {
      this.currentUser.skillSet = this.skillSets.concat(newSkillSet);
      this.currentUser.qaSkillSet = [];
    }
    else {
      this.currentUser.qaSkillSet = this.skillSets.concat(newSkillSet);
      this.currentUser.skillSet = [];
    }
  }

  UpdateTheUserDetails() {
    this.userService.update(this.currentUser).subscribe(resp => {
      CommonUtil.ShowSuccessAlert(MessageManager.UpdateSuccess);
      sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      //clear and rebind the list
      this.OnCancelClick();
      this.GetSkillSetsByPanel();
    }, err => {
      CommonUtil.ShowErrorAlert(MessageManager.UpdateError);
    });
  }

  OnDelete(skillsetItem) {
    CommonUtil.ShowLoading();
    this.skillSets = this.skillSets.filter(x => { return x.id != skillsetItem.id })
    //this.FillSkillSet(this.skillSets);
    if (this.isDevPanel) {
      this.currentUser.skillSet = this.skillSets;
      this.currentUser.qaSkillSet = [];
    }
    else {
      this.currentUser.qaSkillSet = this.skillSets;
      this.currentUser.skillSet = [];
    }
    this.UpdateTheUserDetails();
  }

}
