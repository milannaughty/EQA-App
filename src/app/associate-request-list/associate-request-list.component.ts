import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService } from '../_services/index';
@Component({
  selector: 'app-associate-request-list',
  templateUrl: './associate-request-list.component.html',
  styleUrls: ['./associate-request-list.component.css']
})
export class AssociateRequestListComponent implements OnInit {
  NewRequest: any;
  loading: boolean;
  @Output() messageEvent = new EventEmitter<any>();
  @Input() currentUser: any;
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    
    this.loading = true;
    this.requestService.getAssociateAllRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
      this.NewRequest = this.NewRequest.map(requestData => { this.GetCurrPanelReviewStatusForRequest(requestData); return requestData; });
    });
  }

  private ShowRequestDetails(data,showRemarkBox) {
    console.log('Redirecting from request list to request detail view');
    data["showRemark"] = showRemarkBox;
    this.messageEvent.emit({ ActivateTab: 'Request Detail', data: data });
  }

  private LoadCurrentPanelData(currentRequestData) {
    let panelList = this.currentUser.panelType == 'Dev' ? "assignedDevPanelList" : "assignedQAPanelList";
    return currentRequestData[panelList].filter(x => x.id == this.currentUser._id)[0];
  }

  private GetCurrPanelReviewStatusForRequest(requestData) {
    let panelData = this.LoadCurrentPanelData(requestData);
    requestData.CurrPanelReviewStatusForRequest = panelData.status;
  }
}
