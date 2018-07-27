import { Component, OnInit, Input } from '@angular/core';
import { adminConfig } from "../app.config";
@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit {
  @Input() status;
  RequestStatus = adminConfig.RequestStatus;
  constructor() { }

  ngOnInit() {
  }

}
