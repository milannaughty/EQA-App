import { Component, OnInit, Input } from '@angular/core';
import { SkillSetsService } from '../_services';
import { SkillSets } from '../_models';

@Component({
  selector: 'app-panel-home-page',
  templateUrl: './panel-home-page.component.html',
  styleUrls: ['./panel-home-page.component.css']
})
export class PanelHomePageComponent implements OnInit {

  @Input() currentUser: any;
  showSelectPanelType: boolean;
  isDevSelected: boolean;
  qaSkillList: any;
  skillList: any;
  dropdownSettings: { singleSelection: boolean; enableSearch: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; minSelectionLimit: number; primaryKey: string; labelKey: string; };
  constructor(private skillSetsService: SkillSetsService) { }

  ngOnInit() {
    this.showSelectPanelType = this.currentUser.panelType == undefined || this.currentUser.panelType == null;
    this.dropdownSettings = { singleSelection: false, enableSearch: true, text: "Select Skillsets", selectAllText: 'Select All', unSelectAllText: 'UnSelect All', enableSearchFilter: true, minSelectionLimit: 1, primaryKey: "_id", labelKey: "skillName" };
    this.skillSetsService.getSkillSetsByType("Dev").subscribe(devSkills => { this.skillList = this.getFormattedSkillSet(devSkills); })
    this.skillSetsService.getSkillSetsByType("Qa").subscribe(qaSkillSet => { this.qaSkillList = this.getFormattedSkillSet(qaSkillSet); })
  }
  getFormattedSkillSet(skillSet: any[]) {
    var t = (skillSet as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
    t = t.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
    return t;
  }

  OnPanelClick(type, e) {
    this.currentUser.panelType = type;
    this.isDevSelected = type == 'Dev';

  }

  OnSave() {
    if (this.isDevSelected)
      this.currentUser.qaSkillSet = [];
    else
      this.currentUser.skillSet = [];
  }

}
