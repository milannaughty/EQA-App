import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService } from '../_services/index';

@Component({
  selector: 'associate-new-request-list',
  templateUrl: './associate-new-request-list.component.html',
  styleUrls: ['./associate-new-request-list.component.css']
})
export class AssociateNewRequestListComponent implements OnInit {
  NewRequest: any;
  loading: boolean;
  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
    
  }
  ClickAccept(id:string){
    debugger;
    var requestDto = {
      "currentUserId": this.currentUser._id,
      "currentUserName" :this.currentUser.username,
      "requestId":id,
      "status": "InProgress"
    };
    this.loading = true;
    this.requestService.updateStatusOfRequest(requestDto).subscribe(result => {
    this.loading = false;
    this.NewRequest = result;
    });
  }  

  ClickReject(id:string){
    debugger;
    var requestDto = {
      "currentUserId": this.currentUser._id,
      "currentUserName" :this.currentUser.username,
      "requestId":id,
      "status": "Rejected"
    };
    if(this.currentUser.panelType=='Dev')
      {
        requestDto["assidnedDevPanel"]=null;
      }
      else{
        requestDto["assidnedQaPanel"]=null;
      }
    this.requestService.updateStatusOfRequest(requestDto).subscribe(result => {
      this.loadNewRequestForAssociate() 
    });
  }  

  private ShowRequestDetails(data,showRemarkBox) {
    console.log(data);
    console.log('Redirecting from request list to request detail view');
    data["showRemark"] = showRemarkBox;
    this.messageEvent.emit({ ActivateTab: 'Request Detail', data: data });
  }
  private loadNewRequestForAssociate() {
    this.loading = true;
    this.requestService.getAssociateNewRequest(this.currentUser._id).subscribe(result => {
    this.loading = false;
    this.NewRequest = result;
    });
  }

}
