import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../_services/request.service';
import { adminConfig, userConfig, appConfig } from '../app.config';
import { CommonUtil, EmailManager, MessageManager } from '../app.util'
import sweetalert from 'sweetalert2';
import { EmailService } from '../_services';

@Component({
  selector: 'app-team-checklist-form',
  templateUrl: './team-checklist-form.component.html',
  styleUrls: ['./team-checklist-form.component.css']
})
export class TeamChecklistFormComponent implements OnInit {
  isAnyOpenCheckListItem: boolean;
  TeamReplyReviewComment: any;
  selectedRequestData: any;
  closeCheckListItem: { _Id: number; CheckListItem: string; Description: string; }[];
  openCheckListItem: { _Id: number; CheckListItem: string; Description: string; }[];
  CheckListDetails: any;
  showCheckList: boolean;
  NewRequest: Object;
  loading: boolean;
  result: Object;
  currentUser: any;
  modelChkList = [];

  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  allPreviousReviewComment: any = [];
  devPreviousReviewComment: any = [];
  qaPreviousReviewComment: any = [];
  constructor(private requestService: RequestService, private emailService: EmailService) { }

  ngOnInit() {
    this.LoadRequestUnderVerification();
  }

  private LoadRequestUnderVerification() {
    this.loading = true;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    this.requestService.getTeamAllRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      var requestUnderVerifications = CommonUtil.GetFilteredRequestList(result, adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus);
      this.NewRequest = requestUnderVerifications;//.map(x => )
    });
  }

  private ShowCheckListDetails(currentRequestData) {
    this.showCheckList = true;
    this.selectedRequestData = currentRequestData;
    this.selectedRequestData.GennericCheckListItems = this.selectedRequestData.GennericCheckListItems.sort(x => !x.status);
    this.openCheckListItem = currentRequestData.GennericCheckListItems.filter(x => x["status"] != undefined && x["status"] == 1);
    this.closeCheckListItem = currentRequestData.GennericCheckListItems.filter(x => x["status"] != undefined && x["status"] == 0);
    this.PopulateCheckList();
    this.isAnyOpenCheckListItem = this.openCheckListItem.length || this.devPreviousReviewComment.length || this.qaPreviousReviewComment.length;
  }

  private OnCancelClick() {
    this.showCheckList = false;
  }

  private OnSaveClick() {
    CommonUtil.ShowLoading();
    this.selectedRequestData.teamLastActivity = new Date();
    this.requestService.updateStatusOfRequest(this.selectedRequestData).subscribe(
      result => {
        debugger;
        let adminContactData = CommonUtil.GetAdminContactDetails();
        let devReviewersEmailIDs = this.selectedRequestData.assignedDevPanelList ? this.selectedRequestData.assignedDevPanelList.map(dev => dev.emailID) : [];
        let qaReviewersEmailIDs = this.selectedRequestData.assignedQAPanelList ? this.selectedRequestData.assignedQAPanelList.map(dev => dev.emailID) : [];
        let reviewersEmailIDs = devReviewersEmailIDs.concat(qaReviewersEmailIDs).join(',');
        let reviewersUserName = EmailManager.GetUserNameFromCommaSepratedEmailIds(reviewersEmailIDs);
        let teamName = CommonUtil.Capitalize(this.selectedRequestData.initiatedBy.TeamName);

        var mailSubject = EmailManager.GetReviewedByTeamSubjectLine(teamName);
        var mailObject = {
          fromPersonName: appConfig.fromPersonName,
          fromPersonMailId: appConfig.fromPersonMailId,
          toPersonName: reviewersUserName,
          toPersonMailId: reviewersEmailIDs,
          ccPersonList: adminContactData.emailIDs,
          mailSubject: mailSubject,
          mailContent: "",
          teamName: teamName
        };

        this.emailService.SendMailTeamReviewFeedback(mailObject)
          .subscribe(result => {
            CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccess)
            this.showCheckList = false;
          }, error => {
            CommonUtil.ShowSuccessAlert('IQA Request updated successfully, unable to send email');
            this.showCheckList = false;
          });
      }, error => {
        CommonUtil.ShowSuccessAlert('IQA Request initiated successfully, unable to send email');
        this.showCheckList = false;
      });
  }

  private PopulateCheckList() {

    //All Dev panel review items
    if (this.selectedRequestData.assignedDevPanelList) {
      this.devPreviousReviewComment = this.GetAllReviewCommentFor('DEV');
    }
    //All QA panel review items
    if (this.selectedRequestData.assignedQAPanelList) {
      this.qaPreviousReviewComment = this.GetAllReviewCommentFor('QA');
    }

    //Close review comments
    this.allPreviousReviewComment = this.devPreviousReviewComment.concat(this.qaPreviousReviewComment).filter(x => x.status == 0 || x.status == 2);

    //Show only open status review
    this.devPreviousReviewComment = this.devPreviousReviewComment.filter(x => x.status == 1);
    this.qaPreviousReviewComment = this.qaPreviousReviewComment.filter(x => x.status == 1);

  }

  private GetAllReviewCommentFor(type) {
    var tempPanel = type == 'DEV' ? 'assignedDevPanelList' : 'assignedQAPanelList';
    return this.selectedRequestData[tempPanel].reduce((accumulator, curr) => {
      if (!curr.reviewCheckListItems)
        curr.reviewCheckListItems = [];
      else {
        curr.reviewCheckListItems = curr.reviewCheckListItems.map(x => { x["panelType"] = type; x["raisedBy"] = EmailManager.GetUserNameFromCommaSepratedEmailIds(curr.itemName); return x });
      }
      return accumulator.concat(curr.reviewCheckListItems)
    }, []);
  }

  GetDisplayStatus(DBStatus) {
    return CommonUtil.GetDisplayStatus(DBStatus);
  }
}

