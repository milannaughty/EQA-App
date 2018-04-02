import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../_services/index';
@Component({
  selector: 'app-associate-request-list',
  templateUrl: './associate-request-list.component.html',
  styleUrls: ['./associate-request-list.component.css']
})
export class AssociateRequestListComponent implements OnInit {
  NewRequest: Object;
  loading: boolean;
  @Input() currentUser: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    this.loading = true;
    this.userService.GetAssociateAllRequest(this.currentUser.id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
    });
  }

}
