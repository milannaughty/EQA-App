import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService } from '../_services/index';

@Component({
  selector: 'admin-request-list',
  templateUrl: './admin-team-request.component.html',
  styleUrls: ['./admin-team-request.component.css']
})
export class AdminRequestComponent implements OnInit {
  loading = false;
  model: any = {};
 
  constructor(
  //  private router: Router,
    private requestService: RequestService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    
  }

  createRequest() {
    this.loading = true;
    
  }

}
