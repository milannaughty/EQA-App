import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../_services/request.service';
import { adminConfig, userConfig } from '../app.config';
import { CommonUtil } from '../app.util'

@Component({
  selector: 'app-team-checklist-form',
  templateUrl: './team-checklist-form.component.html',
  styleUrls: ['./team-checklist-form.component.css']
})
export class TeamChecklistFormComponent implements OnInit {
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
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.LoadRequestUnderVerification();
  }

  private LoadRequestUnderVerification() {
    this.loading = true;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    this.requestService.getTeamAllRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      var requestUnderVerifications = CommonUtil.GetFilteredRequestList(result, adminConfig.RequestStatus.UNDER_VERIFICATION);
      this.NewRequest =  requestUnderVerifications;//.map(x => )
    });
  }

  private ShowCheckListDetails(data) {
    this.showCheckList = true;
    this.selectedRequestData = data;
    this.TeamReplyReviewComment = data.verificationStatus.TeamReplyReviewComment || ''
    var requestCheckListDetails = data.CheckListDetails;
    var filterData = CommonUtil.CheckListDetails.filter(x => {
      var y = requestCheckListDetails.filter(rchk => rchk._Id == x._Id)[0];
      if (y) {
        x["status"] = y.status == 0 ? 'Close' : 'Open';
        return x;
      }
      return;
    });

    this.closeCheckListItem = filterData.filter(x => x["status"] != undefined && x["status"] == 'Close');
    this.openCheckListItem = filterData.filter(x => x["status"] != undefined && x["status"] == 'Open');
  }

  private OnCancelClick() {
    this.showCheckList = false;
  }

  private OnSaveClick() {
    var checkListDetails = this.selectedRequestData.CheckListDetails;
    this.modelChkList.map(function (status, id) {
      var tempResultCheckListDetails = checkListDetails.map(rchk => {
        if (rchk && rchk._Id == id) {
          rchk["status"] = status ? 0 : 1;  //If status is true it means close checkbox is clicked
        }
        return rchk;
      })
    })
    //Check if any item is in open state
    if (this.selectedRequestData.CheckListDetails.some(x => x.status == 1)) {
      alert('You must close all open check list items.');
      return;
    }

    if (!this.TeamReplyReviewComment) {
      alert('You must enter review comment replay');
      return;
    }

    var qaReviewStatus = this.selectedRequestData.verificationStatus && this.selectedRequestData.verificationStatus.QAReviewStatus;
    var devReviewStatus = this.selectedRequestData.verificationStatus && this.selectedRequestData.verificationStatus.DevReviewStatus;
    var devReviewComment = this.selectedRequestData.verificationStatus && this.selectedRequestData.verificationStatus.DevReviewComment;
    var qaReviewComment = this.selectedRequestData.verificationStatus && this.selectedRequestData.verificationStatus.QAReviewComment;

    var updateAttributes = {
      requestId: this.selectedRequestData._id,
      status: adminConfig.RequestStatus.UNDER_VERIFICATION,
      verificationStatus: { //MUST PASS FOLLOWING PROPERTIES UNDER verificationStatus Attr.
        IsActionNeededByPanel:true,
        QAReviewStatus: qaReviewStatus,
        DevReviewStatus: devReviewStatus,
        QAReviewComment: qaReviewComment,
        DevReviewComment: devReviewComment,
        TeamReviewStatus: adminConfig.RequestStatus.VERIFIED_BY_TEAM,
        TeamReplyReviewComment: this.TeamReplyReviewComment,
        TeamReviewDate: new Date()
      }
    };

    this.requestService.updateStatusOfRequest(updateAttributes).subscribe(
      result => {
      },
      err => {

      });

  }
}

