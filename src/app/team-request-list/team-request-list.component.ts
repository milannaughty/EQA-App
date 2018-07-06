import { Component, OnInit, Input } from '@angular/core';
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
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    debugger;
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.requestService.getTeamAllRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      var resultTemp =result;
      this.NewRequest = result;
    });
  }

}
