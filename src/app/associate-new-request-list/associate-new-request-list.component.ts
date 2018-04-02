import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../_services/index';

@Component({
  selector: 'associate-new-request-list',
  templateUrl: './associate-new-request-list.component.html',
  styleUrls: ['./associate-new-request-list.component.css']
})
export class AssociateNewRequestListComponent implements OnInit {
  NewRequest: any;
  loading: boolean;
  @Input() currentUser: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    this.loading = true;
    this.userService.GetAssociateNewRequest(this.currentUser.id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
    });
  }

}
