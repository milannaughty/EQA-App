import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { CommonUtil, EmailManager, MessageManager, ConstantString } from '../app.util';
import swal from 'sweetalert2';
import { AlertService, SkillSetsService, EmailService } from '../_services';
import { SkillSets } from '../_models';

@Component({
  selector: 'app-team-request-detail',
  templateUrl: './team-request-detail.component.html',
  styleUrls: ['./team-request-detail.component.css']
})

export class TeamRequestDetailComponent implements OnInit {
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  isSkillLoaded: boolean = false;
  devSkillSet: any;
  qaSkillSet: any;
  loading: boolean;
  isDevSkillMore: boolean;
  isQaSkillMore: boolean;
  assignDevPanelList: any;
  assignQaPanelList: any;
  devPanel: any;
  qaPanel: any;
  Infodeails: any;

  //Update
  showEditForm: boolean;
  skillList: { id: any; itemName: any; }[];
  qaSkillList: { id: any; itemName: any; }[];
  dropdownSettingsDEV: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  dropdownSettingsQA: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  isEditFormLoaded: any;
  showRequestDataForm: boolean = true;

  constructor(private userService: UserService, private skillSetsService: SkillSetsService, private requestService: RequestService) { }



  ngOnInit() {

    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    //debugger;
    console.log('In Request Detail Method')
    this.loading = true
    this.showRequestDataForm = true;
    //for edit form -> to reload cache data
    this.skillList = null;
    //end

    this.userService.getPanelBySkills(this.currentRequestData.body.skillSet, this.currentRequestData.body.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      this.loading = false
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));
      var devstr = this.currentRequestData.body.skillSet.map(x => x.itemName).join(',');
      var arr = devstr.split(',');
      var count = arr.length;
      if (count <= 3) {
        this.isDevSkillMore = false;
      }
      this.devSkillSet = devstr.substring(0, CommonUtil.getNthIndexOfString(devstr, ',', 3));
      var qaStr = this.currentRequestData.body.qaSkillSet.map(x => x.itemName).join(',');
      var arr = qaStr.split(',');
      var count = arr.length;
      if (count <= 3) {
        this.isQaSkillMore = false;
      }
      this.qaSkillSet = qaStr.substring(0, CommonUtil.getNthIndexOfString(qaStr, ',', 3));
      this.devPanel = this.currentRequestData.body.assignedDevPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
      this.qaPanel = this.currentRequestData.body.assignedQAPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
    });
  }
  ShowRequestList1() {
    //debugger;
    this.messageEvent.emit({ ActivateTab: 'HOME' });
  }

  devSkillAlert() {
    var devstr = this.currentRequestData.body.skillSet.map(x => x.itemName).join(',');
    //debugger;
    var title = 'Required Dev Skill';
    var htmlContent = CommonUtil.GetTabularData(devstr, 5, title);
    CommonUtil.ShowInfoAlert('Required Dev Skills', htmlContent);
  }
  qaSkillAlert() {
    var qaStr = this.currentRequestData.body.qaSkillSet.map(x => x.itemName).join(',');
    var title = 'Required Qa Skill';
    var htmlContent = CommonUtil.GetTabularData(qaStr, 5, title);
    CommonUtil.ShowInfoAlert('Required QA Skills', htmlContent);
  }
  getEmailfromDev() {
    var arr = this.currentRequestData.body.assignDevPanelList;
    console.log(arr);
  }

  showUserDeatail(recievedUserData) {
    //debugger;
    this.userService.getById(recievedUserData.id).subscribe(result => {
      //console.log(JSON.stringify(result));
      //debugger;
      EmailManager.userDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
    });
    console.log(recievedUserData);
  }

  //** UPDATE CODE */

  ShowEditForm() {
    this.showEditForm = !this.showEditForm;
    this.showRequestDataForm = !this.showRequestDataForm;
    if (this.showEditForm) {
      this.isEditFormLoaded = false;
      if (!this.skillList) {
        this.skillSetsService.getSkillSetsByType("Dev").subscribe(
          devSkills => {
            this.skillList = (devSkills as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
            this.skillList = this.skillList.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
            this.isEditFormLoaded = true;
          })

        this.skillSetsService.getSkillSetsByType("Qa").subscribe(
          qaSkillSet => {
            this.qaSkillList = (qaSkillSet as SkillSets[]).map(x => ({ id: x["_id"], itemName: x["skillName"] }));
            this.qaSkillList = this.qaSkillList.sort((x, y) => x.itemName && x.itemName.localeCompare(y.itemName));
            this.isEditFormLoaded = true;
          })
      }
      else {
        this.isEditFormLoaded = true;
      }

      this.dropdownSettingsDEV = {
        singleSelection: false,
        text: ConstantString.SelectDevSkill,
        selectAllText: ConstantString.SelectAll,
        unSelectAllText: ConstantString.UnSelectAll,
        enableSearchFilter: true
      };
      this.dropdownSettingsQA = {
        singleSelection: false,
        text: ConstantString.SelectQASkill,
        selectAllText: ConstantString.SelectAll,
        unSelectAllText: ConstantString.UnSelectAll,
        enableSearchFilter: true
      };
    }
  }

  UpdateRequest() {
    CommonUtil.ShowLoading();
    this.currentRequestData.body.UpdatedBy = this.currentRequestData.currentUser.username;
    this.currentRequestData.body.UpdatedOn = new Date();
    this.currentRequestData.body.teamLastActivivty = this.currentRequestData.body.UpdatedOn;
    this.requestService.updateRequest(this.currentRequestData.body).subscribe(res => {
      CommonUtil.ShowSuccessAlert(MessageManager.UpdateSuccess);
      this.ShowEditForm();
      this.ShowRequestDetails();
    }, err => {
      CommonUtil.ShowErrorAlert(MessageManager.UpdateError);
      this.ShowEditForm();
      this.ShowRequestDetails();
    })

  }

}
