import { Component, OnInit, Input } from '@angular/core';
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
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    debugger;
    this.loading = true;
    this.requestService.getAssociateNewRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
    });
  }

}
