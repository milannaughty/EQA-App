import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../_services/request.service';
import { adminConfig, userConfig } from '../app.config';
import { CommonUtil, EmailManager, MessageManager } from '../app.util'
import sweetalert from 'sweetalert2';

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
  constructor(private requestService: RequestService) { }

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
    //this.TeamReplyReviewComment = data.verificationStatus.TeamReplyReviewComment || ''
    //var requestCheckListDetails = currentRequestData.CheckListDetails;
    // var filterData = CommonUtil.CheckListDetails.filter(x => {
    //   var y = requestCheckListDetails.filter(rchk => rchk._Id == x._Id)[0];
    //   if (y) {
    //     x["status"] = y.status == 0 ? 'Close' : 'Open';
    //     return x;
    //   }
    //   return;
    // });

    this.openCheckListItem = currentRequestData.GennericCheckListItems.filter(x => x["status"] != undefined && x["status"] == 1);
    this.closeCheckListItem = currentRequestData.GennericCheckListItems.filter(x => x["status"] != undefined && x["status"] == 0);
    this.isAnyOpenCheckListItem = this.openCheckListItem.length > 0;
    this.PopulateCheckList();
  }

  private OnCancelClick() {
    this.showCheckList = false;
  }

  private OnSaveClick() {
    this.selectedRequestData.teamLastActivity = new Date();
    this.requestService.updateStatusOfRequest(this.selectedRequestData).subscribe(
      result => {
        CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccess)
        this.showCheckList = false;
      },
      err => {
        CommonUtil.ShowErrorAlert('Error occured. Please contact your service provider');
      });

  }

  private PopulateCheckList() {
    //TODO:: Fetch data from database
    // if (!this.selectedRequestData.GennericCheckListItems)
    //   this.selectedRequestData.GennericCheckListItems = CommonUtil.CheckListDetails;
    //All Dev panel review items

    if (this.selectedRequestData.assignedDevPanelList) {
      this.devPreviousReviewComment = this.GetAllReviewCommentFor('DEV');
    }
    //All QA panel review items
    if (this.selectedRequestData.assignedQAPanelList) {
      this.qaPreviousReviewComment = this.GetAllReviewCommentFor('QA');
    }

    //Close review comments
    this.allPreviousReviewComment = this.devPreviousReviewComment.concat(this.qaPreviousReviewComment).filter(x => x.status == 0);
    
    //Show only open status review
    this.devPreviousReviewComment = this.devPreviousReviewComment.filter(x => x.status == 1);
    this.qaPreviousReviewComment = this.qaPreviousReviewComment.filter(x => x.status == 1);
    //this.currentRequestData.CheckListDetails.map(x => { this.modelRdbSelectedItem[x._Id] = x.status == 1 })

  }

  private GetAllReviewCommentFor(type) {
    var tempPanel = type == 'DEV' ? 'assignedDevPanelList' : 'assignedQAPanelList';
    return this.selectedRequestData[tempPanel].reduce((accumulator, curr) => {
      if (!curr.reviewCheckListItems)
        curr.reviewCheckListItems = [];
      else {
        //Ignore current panel comments if exist
        //if (curr.id == this.currentUser._id)
        //return accumulator.concat([]);
        //else
        curr.reviewCheckListItems = curr.reviewCheckListItems.map(x => { x["panelType"] = type; x["raisedBy"] = EmailManager.GetUserNameFromCommaSepratedEmailIds(curr.itemName); return x });
      }
      return accumulator.concat(curr.reviewCheckListItems)
    }, []);
  }

  GetDisplayStatus(DBStatus) {
    return CommonUtil.GetDisplayStatus(DBStatus);
  }
}

