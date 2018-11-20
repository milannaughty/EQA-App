import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SkillSetsService, UserService } from '../_services';
import { SkillSets } from '../_models';
import { ConstantString, CommonUtil, MessageManager } from '../app.util';

@Component({
  selector: 'app-panel-home-page',
  templateUrl: './panel-home-page.component.html',
  styleUrls: ['./panel-home-page.component.css']
})
export class PanelHomePageComponent implements OnInit {

  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  showSelectPanelType: boolean;
  isDevSelected: boolean;
  qaSkillList: any;
  skillList: any;
  model: any = {};
  dropdownSettings: { singleSelection: boolean; enableSearch: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; minSelectionLimit: number; primaryKey: string; labelKey: string; };
  enableButton: any;
  loading: boolean;
  constructor(private skillSetsService: SkillSetsService, private userService: UserService) { }

  ngOnInit() {
    this.showSelectPanelType = this.currentUser.isPanel && (this.currentUser.panelType == undefined || this.currentUser.panelType == null);
    this.dropdownSettings = { singleSelection: false, enableSearch: true, text: ConstantString.SelectSkill, selectAllText: ConstantString.SelectAll, unSelectAllText: ConstantString.UnSelectAll, enableSearchFilter: true, minSelectionLimit: 1, primaryKey: "_id", labelKey: "skillName" };
    this.skillSetsService.getSkillSetsByType(ConstantString.Dev).subscribe(devSkills => { this.skillList = this.GetFormattedSkillSet(devSkills); })
    this.skillSetsService.getSkillSetsByType(ConstantString.QA).subscribe(qaSkillSet => { this.qaSkillList = this.GetFormattedSkillSet(qaSkillSet); })
  }
  GetFormattedSkillSet(skillSet: any[]) {
    var t = (skillSet as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
    return t.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
  }

  OnPanelClick(type, e) {
    this.currentUser.panelType = type;
    this.isDevSelected = type == ConstantString.Dev;
    if (this.isDevSelected)
      this.model.qaSkillSet = [];
    else
      this.model.skillSet = [];
    //Enable disabled button
    this.OnSkillDropDownChange();
  }

  OnSave() {

    if (this.isDevSelected) {
      this.currentUser.skillSet = this.model.skillSet;
      this.currentUser.qaSkillSet = [];
    }
    else {
      this.currentUser.panelType = ConstantString.QA; //for default case
      this.currentUser.qaSkillSet = this.model.qaSkillSet;
      this.currentUser.skillSet = [];
    }
    //CommonUtil.ShowLoadingWithTitle(MessageManager.UpdatePanelType)
    this.loading = true;
    this.userService.update(this.currentUser).subscribe(resp => {
      this.loading = false;
      CommonUtil.ShowSuccessAlert(MessageManager.UpdateSuccess);
      sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      this.BackToHome();
    }, err => {
      this.loading = false;
      this.currentUser.panelType = '';
      this.currentUser.panelType = [];
      this.currentUser.qaSkillSet = [];
      CommonUtil.ShowErrorAlert(MessageManager.UpdateError);
      this.BackToHome();
    });
  }

  private BackToHome() {
    console.log('Redirecting from request list to request detail view');
    this.messageEvent.emit({ ActivateTab: '', data: {} });
  }
  private OnSkillDropDownChange() {
    this.enableButton = (this.model.skillSet && this.model.skillSet.length) || (this.model.qaSkillSet && this.model.qaSkillSet.length)
  }

}
