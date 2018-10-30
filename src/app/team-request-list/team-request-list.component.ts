import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RequestService } from '../_services/index';

@Component({
  selector: 'app-team-request-list',
  templateUrl: './team-request-list.component.html',
  styleUrls: ['./team-request-list.component.css']
})
export class TeamRequestListComponent implements OnInit {
  NewRequest: Object;
  loading: boolean;
  result: Object;
  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    this.loading = true;
    //this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    this.requestService.getTeamAllRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
    });
  }

  private ShowRequestDetails(data) {
    console.log('Redirecting from request list to request detail view');
    this.messageEvent.emit({ ActivateTab: 'Request Summary Detail', data: data });
  }


}
