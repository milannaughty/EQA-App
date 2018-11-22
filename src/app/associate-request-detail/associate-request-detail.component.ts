import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig } from '../app.config';
import { EmailService } from '../_services/mail.service';
import { adminConfig } from "../app.config";
import { CommonUtil, EmailManager, MessageManager } from '../app.util';
import { debug } from 'util';

@Component({
  selector: 'app-associate-request-detail',
  templateUrl: './associate-request-detail.component.html',
  styleUrls: ['./associate-request-detail.component.css']
})
export class AssociateRequestDetailComponent implements OnInit {
  isCompleteRequestOperation: boolean;
  isRejectRequestOperation: boolean;
  isAcceptRequestOperation: boolean;
  requestCheckListItem: { _Id: number; CheckListItem: string; Description: string; }[];
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  devSkillSet: any;
  qaSkillSet: any;
  isSkillLoaded: boolean = false;
  reasonText: string = '';
  statusList: any = [];
  ddlId: number;
  showCheckList: boolean;
  showLoadingIcon: boolean = false;
  loading: boolean;
  findings;
  futureImpact;
  proposedAction;
  panelComment;
  teamComment;
  areaOfFinding;
  severity;
  checkPointType;
  status;
  isDevSkillMore: boolean;
  isQaSkillMore: boolean;
  devPanel: any;
  qaPanel: any;

  showReviewItemForm: boolean = true;

  newCheckListItems: any = [];
  newCheckListItemsLength: boolean = false;

  //Add Review Dropdown values
  AreaOfFindings = CommonUtil.AreaOfFindings;
  TypeOfSeverity = CommonUtil.TypeOfSeverity;
  CheckPoints = CommonUtil.CheckPoints;
  Status = CommonUtil.Status;
  //End

  isDevPanel: boolean;
  devPreviousReviewComment: any = [];
  qaPreviousReviewComment: any = [];
  allPreviousReviewComment: any = []
  showPreviousReviewComment: boolean;
  currentPanelId: any;
  currentPanelData: any;
  assignedDevPanelListString: string = "assignedDevPanelList";
  assignedQAPanelListString: string = "assignedQAPanelList";
  showCurrentPanelReviewComment: boolean;
  panelList: string; //panel list contains the property name of object IQA Reequest "assignedDevPanelList" or "assignedQAPanelList"
  showRemark: boolean;
  showSaveButton: boolean;


  constructor(private userService: UserService, private requestService: RequestService, private emailService: EmailService) { }

  ngOnInit() {
    this.ShowRequestDetails();
    this.LoadCurrentPanelData();
    this.PopulateStatusDropdown();
  }
  ShowAddReviewItem() {
    this.showReviewItemForm = !this.showReviewItemForm;
  }
  SaveNewReviewItem() {
    if (this.model.findings == undefined || this.model.findings == "" || this.model.futureImpact == "" || this.model.futureImpact == undefined || this.model.proposedAction == "" || this.model.proposedAction == undefined || this.model.panelComment == "" || this.model.panelComment == undefined || this.model.areaOfFinding == "" || this.model.areaOfFinding == undefined || this.model.severity == "" || this.model.severity == undefined || this.model.checkPointType == "" || this.model.checkPointType == undefined) {
      return false;
    }
    var tem = {
      findings: this.model.findings,
      futureImpact: this.model.futureImpact,
      proposedAction: this.model.proposedAction,
      panelComment: this.model.panelComment || false,
      teamComment: this.model.teamComment || false,
      areaOfFinding: this.model.areaOfFinding,
      severity: this.model.severity,
      checkPointType: this.model.checkPointType,
      status: 1 //this.model.status // 1 for open status
    }

    this.newCheckListItems.push(tem);
    this.UpdateNewCheckListItemLength();
    this.clear();
  }
  clear() {
    this.model.findings = "";
    this.model.futureImpact = "";
    this.model.proposedAction = "";
    this.model.panelComment = "";
    this.model.teamComment = "";
    this.model.areaOfFinding = "";
    this.model.severity = "";
    this.model.checkPointType = "";
    this.model.status = "";
  }
  CancelReviewItem() {
    this.ShowAddReviewItem();
  }
  onStatusChange(event) {
    this.isRejectRequestOperation = this.model.selectedStatus == "Rejected";
    this.isCompleteRequestOperation = this.model.selectedStatus == "Completed";
    this.isAcceptRequestOperation = this.model.selectedStatus == "InProgress" //i.e Accept
    this.showRemark = this.isRejectRequestOperation;
    this.showSaveButton = this.isCompleteRequestOperation || this.isRejectRequestOperation || this.isAcceptRequestOperation;
    this.showCheckList = this.isCompleteRequestOperation;
    //this.LoadCurrentPanelData();
    if (this.showCheckList) {
      this.PopulateCheckList();
    }
  }

  ShowRequestDetails() {
    this.loading = true;
    this.userService.getPanelBySkills(this.currentRequestData.body.skillSet, this.currentRequestData.body.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));

      //Create skillsets comma sepreted list
      if (this.currentRequestData.body.skillSet) {
        this.devSkillSet = this.currentRequestData.body.skillSet.slice(0, 3).map(x => x.itemName).join(',');
        if (this.currentRequestData.body.skillSet.length <= 3)
          this.isDevSkillMore = false;
      }
      else {
        this.devSkillSet = "NA";
      }
      if (this.currentRequestData.body.qaSkillSet) {
        this.qaSkillSet = this.currentRequestData.body.qaSkillSet.map(x => x.itemName).slice(0, 3).join(',');
        if (this.currentRequestData.body.qaSkillSet.length <= 3) {
          this.isQaSkillMore = false;
        }
      }
      else {
        this.qaSkillSet = "NA";
      }

      this.devPanel = this.currentRequestData.body.assignedDevPanelList ? this.currentRequestData.body.assignedDevPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) })) : []
      this.qaPanel = this.currentRequestData.body.assignedQAPanelList ? this.currentRequestData.body.assignedQAPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) })) : []
      this.loading = false;
    });
  }

  ShowSkillPopup(type: string) {
    var qaStr = type == 'Dev' ? this.GetCommaSepratedSkills(this.currentRequestData.body.skillSet) : this.GetCommaSepratedSkills(this.currentRequestData.body.qaSkillSet);
    var htmlContent = CommonUtil.GetTabularData(qaStr, 5, null);
    CommonUtil.ShowInfoAlert(`Required ${type} Skills`, htmlContent);
  }

  GetCommaSepratedSkills(skill) {
    return skill.map(x => x.itemName).join(',');
  }

  ShowRequestList() {
    this.messageEvent.emit({ ActivateTab: this.currentRequestData.prevActiveTab || 'HOME' });
  }

  OnCancelClick() {
    this.showCheckList = false;
    this.model.selectedStatus = '';
    this.onStatusChange(null);
  }

  OnSaveClick() {
    //this.showLoadingIcon = true;
    CommonUtil.ShowLoading();
    this.currentPanelData.lastActivity = new Date().toDateString();
    if (this.isRejectRequestOperation) {
      debugger;
      this.currentPanelData.rejectReason = this.reasonText;
      this.currentPanelData.status = adminConfig.RequestStatus.REJECTED.DBStatus;
      let isAllPanelRejectedRequest = this.CheckAllPanelRequestStatus(adminConfig.RequestStatus.REJECTED.DBStatus);
      this.currentRequestData.body.status = isAllPanelRejectedRequest ? adminConfig.RequestStatus.REJECTED.DBStatus : this.currentRequestData.body.status;

      if(Array.isArray(this.currentRequestData.body.rejectHistory)){
        this.currentRequestData.body.rejectHistory.push(this.currentPanelData);
      }else{
        this.currentRequestData.body.rejectHistory=[];
        this.currentRequestData.body.rejectHistory.push(this.currentPanelData);
      }

      if(this.isDevPanel)
        this.currentRequestData.body.assignedDevPanelList = this.currentRequestData.body.assignedDevPanelList.filter(x =>  x.id != this.currentPanelData.id );
      else
        this.currentRequestData.body.assignedQAPanelList = this.currentRequestData.body.assignedQAPanelList.filter(x =>  x.id != this.currentPanelData.id );
      
}
    else if (this.isAcceptRequestOperation) {

      //this.currentRequestData.body.status = adminConfig.RequestStatus.IN_PROGRESS.DBStatus;
      this.currentPanelData.status = adminConfig.RequestStatus.IN_PROGRESS.DBStatus;
      let isAllPanelAcceptedRequest = this.CheckAllPanelRequestStatus(adminConfig.RequestStatus.IN_PROGRESS.DBStatus);
      this.currentRequestData.body.status = isAllPanelAcceptedRequest ? adminConfig.RequestStatus.IN_PROGRESS.DBStatus : this.currentRequestData.body.status;
    }
    else if (this.isCompleteRequestOperation) {
      //Add the newly added review comments to existing reviews
      if (this.newCheckListItemsLength) {
        this.currentPanelData.reviewCheckListItems = this.currentPanelData.reviewCheckListItems ? this.currentPanelData.reviewCheckListItems.concat(this.newCheckListItems) : this.newCheckListItems;
      }
      
      //Close the Generic checklist items if not modified and updated the close by details
      this.currentRequestData.body.GennericCheckListItems = this.currentRequestData.body.GennericCheckListItems.map(x => {
        if (!x.status && !x.raisedByPanelId) {
          x.status = 0;
          x.raisedByPanelType = this.currentRequestData.currentUser.panelType;
          x.raisedByPanelId = this.currentRequestData.currentUser._id;
          x.raisedByPanel = EmailManager.GetUserNameFromCommaSepratedEmailIds(this.currentRequestData.currentUser.username);
        }
        return x;
      });

      //Update Panel checklist status, check any reviewCheckListItems is in open state
      let isAnyGennericCheckListItemOpenByMe = this.currentRequestData.body.GennericCheckListItems.some(x => x.status == 1 && x.raisedByPanelId == this.currentPanelId);
      let isAnyMyCheckListItemOpen = this.currentPanelData.reviewCheckListItems && this.currentPanelData.reviewCheckListItems.some(x => x.status == 1);
      this.currentPanelData.status = (isAnyGennericCheckListItemOpenByMe || isAnyMyCheckListItemOpen) ? adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus : adminConfig.RequestStatus.COMPLETED.DBStatus;
      
      var isAnyPreviousCheckCheckListItemOpen = this.allPreviousReviewComment.some(x => x.status == 1);
      var isAnyGennericCheckListItemOpen = this.currentRequestData.body.GennericCheckListItems.some(x => x.status == 1);
      isAnyMyCheckListItemOpen = this.currentPanelData.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus;
      var isAnyNewlyAddedCheckList = this.newCheckListItemsLength;
      var isAllPanelCompletedRequest = this.CheckAllPanelRequestStatus(adminConfig.RequestStatus.COMPLETED.DBStatus);
      var isIQARequestCompleted = !(isAnyPreviousCheckCheckListItemOpen || isAnyGennericCheckListItemOpen  || isAnyMyCheckListItemOpen || isAnyNewlyAddedCheckList);
      this.currentRequestData.body.status = isAllPanelCompletedRequest && isIQARequestCompleted ? adminConfig.RequestStatus.COMPLETED.DBStatus : adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus;
    }

    this.requestService.updateStatusOfRequest(this.currentRequestData.body).subscribe(
      result => {
        var data = this.currentRequestData.body;
        if (this.isRejectRequestOperation) {//code after rejection
          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail])
          var toPerssonList = data.initiatedBy.POCEmail + ',';
          toPerssonList = toPerssonList+','+JSON.parse(sessionStorage.getItem('adminList')).emailIDs;

          var mailSubject = EmailManager.GetRejectRequestSubjectLine(data.name, this.currentRequestData.currentUser.username);
            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": "Admin",
              "toPersonMailId": toPerssonList,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
              "rejectReason": this.reasonText
            };

            this.emailService.sendMailToAdminsAfterIQARequestRejectedByPanel(mailObject).subscribe(
              success => {
                CommonUtil.ShowInfoAlert(MessageManager.RequestRejectTitle, MessageManager.RequestRejected);
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowSuccessAlert(MessageManager.RequestRejectedWithErrorEmailSending);
                this.ShowRequestList();
              }
            );   
            
            
        }
        else if (this.isAcceptRequestOperation) {//code after acceptance

          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          var toPersonName = EmailManager.GetUserNameFromCommaSepratedEmailIds(toPerssonListAcceptance);
          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail])

          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            if (adminList instanceof Array)
              ccPersonList += adminList.map(x => x.username).join(',');
            else
              ccPersonList += adminList["username"];

            var mailSubject = EmailManager.GetRequestAcceptSubjectLine(data.name, this.currentRequestData.currentUser.FName + " " + this.currentRequestData.currentUser.LName);
            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
            };
            this.emailService.sendMailToPOCAfterIQARequestAcceptedByPanel(mailObject).subscribe(
              success => {
                CommonUtil.ShowInfoAlert(MessageManager.RequestAcceptTitle, MessageManager.RequestAcceptSuccess);
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowSuccessAlert(MessageManager.RequestAcceptSuccessWithErrorEmailSending);
                this.ShowRequestList();
              }
            );

          }, err => {//error while fething admin role users
            CommonUtil.ShowSuccessAlert(MessageManager.RequestAcceptSuccessWithErrorEmailSending);
            this.ShowRequestList();
          });
        }//acceptance block ends here
        //If current panel status completed
        else if (this.currentPanelData.status == adminConfig.RequestStatus.COMPLETED.DBStatus) {//if panel has completed IQA request
          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail]);
          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          let toPersonName = EmailManager.GetUserNameFromCommaSepratedEmailIds(toPerssonListAcceptance);

          this.userService.getAllUsersByRole("admin").subscribe(adminList => {

            if (adminList instanceof Array)
              ccPersonList += ',' + adminList.map(x => x.username).join(',');
            else
              ccPersonList += ',' + adminList["username"];

            var mailSubject = EmailManager.GetIQACompletedSubjectLine(data.name, this.currentRequestData.currentUser.FName + " " + this.currentRequestData.currentUser.LName);

            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
            };
            this.emailService.sendMailToPOCAfterIQARequestCompletedByPanel(mailObject).subscribe(
              success => {
                CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccess);
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccessWithErrorEmailSending);
                this.ShowRequestList();
              }
            );
          }, err => {//error while fething admin role users
            CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccessWithErrorEmailSending);
            this.ShowRequestList();
          });
        }//if panel has completed IQA request If block ends

        ///**************THIS CODE NEED TO TEST************ */
        ///**************THIS CODE NEED TO TEST************ */
        ///**************THIS CODE NEED TO TEST************ */
        ///**************THIS CODE NEED TO TEST************ */
        else if (this.currentRequestData.body.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus) {//request status under verification starts
          //debugger;
          //checklist details starts
          //this.showCheckList = true;
          //this.selectedRequestData = data;
          //this.TeamReplyReviewComment = data.verificationStatus.TeamReplyReviewComment || ''
          // var requestCheckListDetails = this.currentRequestData.body["CheckListDetails"];
          // var filterData = CommonUtil.CheckListDetails.filter(x => {
          //   var y = requestCheckListDetails.filter(rchk => rchk._Id == x._Id)[0];
          //   if (y) {
          //     x["status"] = y.status == 0 ? 'Close' : 'Open';
          //     return x;
          //   }
          //   return;
          // });

          // var closeCheckListItems = filterData.filter(x => x["status"] != undefined && x["status"] == 'Close');
          // var openCheckListItem = filterData.filter(x => x["status"] != undefined && x["status"] == 'Open');


          // var openString = openCheckListItem.map(x => x.CheckListItem).join('|Open|') + "|Open";
          // var closeString = closeCheckListItems.map(x => x.CheckListItem).join('|Close|') + "|Close";
          // var comments = '';
          // if (this.isDevPanel)
          //   comments = requestObject["verificationStatus"] ? requestObject["verificationStatus"].DevReviewComment ? requestObject["verificationStatus"].DevReviewComment : '' : '';
          // else
          //   comments = requestObject["verificationStatus"] ? requestObject["verificationStatus"].QAReviewComment ? requestObject["verificationStatus"].QAReviewComment : '' : '';
          // //checklist details ends

          //mail Object starts
          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail]);
          let toPersonName = EmailManager.GetUserNameFromCommaSepratedEmailIds(toPerssonListAcceptance);// toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).charAt(0).toUpperCase() + toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).slice(1);
          var mailSubject = EmailManager.GetIQARequestUpdatedSubjectLine(data.name, this.currentRequestData.currentUser.FName + " " + this.currentRequestData.currentUser.LName);
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {

            if (adminList instanceof Array)
              ccPersonList += ',' + adminList.map(x => x.username).join(',');
            else
              ccPersonList += ',' + adminList["username"];

            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
              "panelComments": 'comments',
              "checkListDetails": 'openString' + "|" + 'closeString'
            }

            this.emailService.sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel(mailObject).subscribe(
              result => {
                CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccess);
                this.showLoadingIcon = false;
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowErrorAlert(MessageManager.RequestUpdateSuccessWithErrorEmailSending);
                this.showLoadingIcon = false;
                this.ShowRequestList();
              }
            );

          }, err => {
            CommonUtil.ShowErrorAlert(MessageManager.RequestUpdateSuccessWithErrorEmailSending);
            this.showLoadingIcon = false;
            this.ShowRequestList();
          });

          //mail Object ends

        }//request status under verification ends


      }, err => {
        CommonUtil.ShowErrorAlert('Error while updating IQA Request ');
        this.ShowRequestList();
      });
  }

  PopulateStatusDropdown() {
    if (this.currentPanelData.status == 'PanelAssigned') {
      this.statusList.push({ "Id": "InProgress", "Name": "Accept" })
      this.statusList.push({ "Id": "Rejected", "Name": "Rejected" })
    }
    else if (this.currentPanelData.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus || this.currentPanelData.status == adminConfig.RequestStatus.IN_PROGRESS.DBStatus) {
      this.statusList.push({ "Id": "Completed", "Name": "Complete" })
      this.statusList.push({ "Id": "Rejected", "Name": "Rejected" })

    }
    else if (this.currentPanelData.status == adminConfig.RequestStatus.COMPLETED.DBStatus) {
      this.statusList.push({ "Id": "Completed", "Name": "Re-Open" })
    }
    this.model.selectedStatus = this.statusList[0].Name;
  }

  PopulateCheckList() {
    //TODO:: Fetch data from database
    if (!this.currentRequestData.body.GennericCheckListItems)
      this.currentRequestData.body.GennericCheckListItems = CommonUtil.CheckListDetails;
    //All Dev panel review items
    if (this.currentRequestData.body.assignedDevPanelList) {
      this.devPreviousReviewComment = this.GetAllReviewCommentFor('DEV');
    }
    //All QA panel review items
    if (this.currentRequestData.body.assignedQAPanelList) {
      this.qaPreviousReviewComment = this.GetAllReviewCommentFor('QA');
    }

    this.allPreviousReviewComment = this.devPreviousReviewComment.concat(this.qaPreviousReviewComment).sort(x => x.status != 1);
    this.showPreviousReviewComment = this.allPreviousReviewComment.length > 0;
    ////debugger;
    //this.currentRequestData.CheckListDetails.map(x => { this.modelRdbSelectedItem[x._Id] = x.status == 1 })

  }
  showUserDeatail(recievedUserData) {
    this.userService.getById(recievedUserData.id).subscribe(result => {
      console.log(JSON.stringify(result));
      EmailManager.userDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
      CommonUtil.ShowErrorAlert(err.error)
    });
    console.log(recievedUserData);
  }

  getTeamDetails(id) {
    this.userService.getById(id).subscribe(result => {
      console.log(JSON.stringify(result));
      EmailManager.teamDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
      CommonUtil.ShowErrorAlert(err.error)
    });
  }

  RemoveNewCheckListItem(index) {
    this.newCheckListItems.splice(index, 1);
    this.UpdateNewCheckListItemLength();
  }

  UpdateNewCheckListItemLength() {
    this.newCheckListItemsLength = this.newCheckListItems.length > 0 ? true : false;
  }

  LoadCurrentPanelData() {
    this.isDevPanel = this.currentRequestData.currentUser.panelType == 'Dev';
    this.currentPanelId = this.currentRequestData.currentUser._id;
    this.panelList = this.isDevPanel ? this.assignedDevPanelListString : this.assignedQAPanelListString;
    this.currentPanelData = this.currentRequestData.body[this.panelList].filter(x => x.id == this.currentPanelId)[0];
    this.showCurrentPanelReviewComment = this.currentPanelData.reviewCheckListItems && this.currentPanelData.reviewCheckListItems.length > 0;
  }
  GetAllReviewCommentFor(type) {
    var tempPanel = type == 'DEV' ? this.assignedDevPanelListString : this.assignedQAPanelListString;
    return this.currentRequestData.body[tempPanel].reduce((accumulator, curr) => {
      if (!curr.reviewCheckListItems)
        curr.reviewCheckListItems = [];
      else {
        //Ignore current panel comments if exist
        if (curr.id == this.currentPanelId)
          return accumulator.concat([]);
        else
          curr.reviewCheckListItems = curr.reviewCheckListItems.map(x => { x["panelType"] = type; x["raisedBy"] = EmailManager.GetUserNameFromCommaSepratedEmailIds(curr.itemName); return x });
      }
      return accumulator.concat(curr.reviewCheckListItems)
    }, []);
  }

  GetDisplayStatus(DBStatus) {
    return CommonUtil.GetDisplayStatus(DBStatus);
  }

  OnGenericReviewStatusChanged(data) {
    data.raisedByPanelType = this.currentRequestData.currentUser.panelType;
    data.raisedByPanelId = this.currentRequestData.currentUser._id;
    data.raisedByPanel = EmailManager.GetUserNameFromCommaSepratedEmailIds(this.currentRequestData.currentUser.username);
  }

  CheckAllPanelRequestStatus(inputStatus) {
    return (this.currentRequestData.body.assignedDevPanelList.length==0 || this.currentRequestData.body.assignedDevPanelList.some(panel => panel.status == inputStatus)) && (this.currentRequestData.body.assignedQAPanelList.length==0 ||this.currentRequestData.body.assignedQAPanelList.some(panel => panel.status == inputStatus));
  }

}


