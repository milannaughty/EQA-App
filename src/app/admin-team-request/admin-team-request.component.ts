import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService } from '../_services/index';

@Component({
  selector: 'admin-request-list',
  templateUrl: './admin-team-request.component.html',
  styleUrls: ['./admin-team-request.component.css']
})
export class AdminRequestComponent implements OnInit {
  NewRequest: object;
  currentUser: any;
  loading = false;
  model: any = {};
  @Output() messageEvent = new EventEmitter<any>();

  constructor(
    //  private router: Router,
    private requestService: RequestService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadNewRequestForAdmin();
  }
  private ShowRequestDetails(data) {
    debugger;
    console.log('Redirecting from request list to request detail view');
    this.messageEvent.emit({ ActivateTab: 'REQUEST_DETAIL', data: data });
  }
  private loadNewRequestForAdmin() {
    this.loading = true;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    this.requestService.getAll().subscribe(result => {
      this.loading = false;
      var resultTemp = result;
      this.NewRequest = result;
    });
  }

}
