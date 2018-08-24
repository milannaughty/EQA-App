import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {  RequestService } from '../_services/index';
import { adminConfig } from "../app.config";
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'admin-request-list',
  templateUrl: './admin-team-request.component.html',
  styleUrls: ['./admin-team-request.component.css']
})
export class AdminRequestComponent implements OnInit {
  @Input() currentRequestData: any;
  NewRequest: object;
  currentUser: any;
  loading = false;
  model: any = {};
  @Output() messageEvent = new EventEmitter<any>();

  AdminActionList = adminConfig.ActionList;
  RequestStatus = adminConfig.RequestStatus;
  dataTable: any;
  constructor(
    private chRef: ChangeDetectorRef,    private requestService: RequestService
  ) { }

  ngOnInit() {
    this.loadNewRequestForAdmin();
  }
  private ShowRequestDetails(data) {
    console.log('Redirecting from request list to request detail view');
    data["CurrentActionName"] = this.currentRequestData["CurrentActionName"];
    this.messageEvent.emit({ ActivateTab: this.AdminActionList.TeamRequestDetails, data: data });
  }
  private loadNewRequestForAdmin() {
    this.loading = true;
    
    this.requestService.getAll().subscribe(result => {
      this.loading = false;
      this.NewRequest = this.GetFilteredData(result, this.GetRequestedStatus(this.currentRequestData["CurrentActionName"]))
      {
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable();
      }
    });
  }

  GetFilteredData(data, status) {
    return data.filter(x => x.status == status)
  }

  GetRequestedStatus(currentAction) {
    switch (currentAction) {
      case this.AdminActionList.AdminTeamRequestNew:
        return this.RequestStatus.NEW.DBStatus;
      case this.AdminActionList.AdminTeamRequestPending:
        return this.RequestStatus.PANEL_ASSIGNED.DBStatus;
      case this.AdminActionList.AdminTeamRequestInProgress:
        return this.RequestStatus.IN_PROGRESS.DBStatus;
      case this.AdminActionList.AdminTeamRequestCompleted:
        return this.RequestStatus.COMPLETED.DBStatus;
      case this.AdminActionList.AdminTeamRequestRejected:
        return this.RequestStatus.REJECTED.DBStatus;
      case this.AdminActionList.AdminTeamRequestUnderVerification:
        return this.RequestStatus.UNDER_VERIFICATION.DBStatus;
      default:
        break;
    }
  }

}
