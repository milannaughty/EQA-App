import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService } from '../_services/index';
import { adminConfig } from "../app.config";

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

  constructor(
    //  private router: Router,
    private requestService: RequestService,
    private alertService: AlertService
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

      switch (this.currentRequestData["CurrentActionName"]) {
        case this.AdminActionList.AdminTeamRequestNew:
          result = this.GetFilteredData(result, this.RequestStatus.NEW)
          break;
        case this.AdminActionList.AdminTeamRequestPending:
          result = this.GetFilteredData(result, this.RequestStatus.PANEL_ASSIGNED);
          break;
        case this.AdminActionList.AdminTeamRequestInProgress:
          result = this.GetFilteredData(result, this.RequestStatus.IN_PROGRESS);
          break;
        case this.AdminActionList.AdminTeamRequestCompleted:
          result = this.GetFilteredData(result, this.RequestStatus.COMPLETED);
          break;
        default:
          break;
      }
      this.NewRequest = result;
    });
  }

  GetFilteredData(data, status) {
    return data.filter(x => x.status == status)
  }

}
