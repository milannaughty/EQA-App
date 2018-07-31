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
  RequestStatus: any = adminConfig.RequestStatus;

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
      this.NewRequest = CommonUtil.GetFilteredRequestList(result, this.RequestStatus.VERIFIED_BY_PANEL);
    });
  }

  private ShowCheckListDetails(data) {
    this.showCheckList = true;
    this.selectedRequestData = data;
    debugger;//this.currentRequestData;
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
      checkListDetails = checkListDetails.map(rchk => {
        if (rchk && rchk._Id == id) {
          rchk["status"] = status ? 0 : 1;  //If status is true it means close checkbox is clicked
        }
      })
      return;
    })
    //Check if any item is in open state
    if (this.selectedRequestData.CheckListDetails.some(x => x.status == 1)) {
      alert('You must close all open check list items.');
      return;
    }

    if (this.selectedRequestData.TeamReplyReviewComment) {
      alert('You must enter review comment replay');
      return;
    }
    debugger;
  }
}

