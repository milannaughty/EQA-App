import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService } from '../_services/index';
import { adminConfig, userConfig } from "../app.config";
import { ConstantString } from "../app.util";
@Component({
  selector: 'app-associate-request-list',
  templateUrl: './associate-request-list.component.html',
  styleUrls: ['./associate-request-list.component.css']
})
export class AssociateRequestListComponent implements OnInit {
  isDevPanel: boolean;
  NewRequest: any;
  loading: boolean;
  requestStatus: any;
  @Output() messageEvent = new EventEmitter<any>();
  @Input() currentUser: any;
  @Input() currentRequestData: any;
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
    this.isDevPanel = this.currentUser.panelType == ConstantString.Dev;
  }

  private loadNewRequestForAssociate() {

    this.loading = true;
    this.requestService.getAssociateAllRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
      this.NewRequest = this.GetFilteredData(result, this.GetRequestedStatus(this.currentRequestData["CurrentActionName"]))
      this.NewRequest = this.NewRequest.map(requestData => { this.GetCurrPanelReviewStatusForRequest(requestData); return requestData; });
    });
  }

  private ShowRequestDetails(data, showRemarkBox) {
    console.log('Redirecting from request list to request detail view');
    data["showRemark"] = showRemarkBox;
    this.messageEvent.emit({ ActivateTab: 'Request Detail', data: data });
  }

  private LoadCurrentPanelData(currentRequestData) {
    let panelList = this.currentUser.panelType == 'Dev' ? "assignedDevPanelList" : "assignedQAPanelList";
    return currentRequestData[panelList].filter(x => x.id == this.currentUser._id)[0];
  }

  private GetCurrPanelReviewStatusForRequest(requestData) {
    debugger;
    let panelData = this.LoadCurrentPanelData(requestData);
    requestData.CurrPanelReviewStatusForRequest = panelData.status;
  }

  GetFilteredData(data, status) {
    if (status == 'ALL')
      return data;//.filter(x => x.status == adminConfig.RequestStatus.IN_PROGRESS.DBStatus || x.status == adminConfig.RequestStatus.COMPLETED.DBStatus || x.status == adminConfig.RequestStatus.REJECTED.DBStatus || x.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus)
    else {
      //here data means current request data
      return data.filter(request => {
        console.log({request,status})
        var res = [];
        if (this.isDevPanel) {
          res = request.assignedDevPanelList.filter(panel => panel.status == status);
        }
        else {
          res = request.assignedQAPanelList.filter(panel => panel.status == status);
        }

        if (res.length > 0)
          return request;
      })
    }
  }

  GetRequestedStatus(currentAction) {
    switch (currentAction) {
      case userConfig.ActionList.EQANewRequests:
        return adminConfig.RequestStatus.NEW.DBStatus;
      case userConfig.ActionList.InitiateEQARequest:
        return adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus;
      case userConfig.ActionList.EQAComplete:
        return adminConfig.RequestStatus.COMPLETED.DBStatus;
      case userConfig.ActionList.EQASummary:
        return 'ALL';
      case userConfig.ActionList.UnderVerification:
        return adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus;
      default:
        break;
    }
  }
}


