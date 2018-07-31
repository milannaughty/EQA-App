import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService } from '../_services/index';
@Component({
  selector: 'app-associate-request-list',
  templateUrl: './associate-request-list.component.html',
  styleUrls: ['./associate-request-list.component.css']
})
export class AssociateRequestListComponent implements OnInit {
  NewRequest: Object;
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
    });
  }

  private ShowRequestDetails(data,showRemarkBox) {
    console.log('Redirecting from request list to request detail view');
    data["showRemark"] = showRemarkBox;
    this.messageEvent.emit({ ActivateTab: 'Request Detail', data: data });
  }
}
