import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs/observable/from';
import { CommonUtil } from '../app.util';
import { RequestService } from '../_services';
import { adminConfig } from '../app.config';
@Component({
  selector: 'app-panel-availability-status',
  templateUrl: './panel-availability-status.component.html',
  styleUrls: ['./panel-availability-status.component.css']
})
export class PanelAvailabilityStatusComponent implements OnInit {
  RequestData: Object;
  loading: boolean;

  constructor(private requestService: RequestService) { }
  requeststatus = adminConfig.RequestStatus;
  yearList = CommonUtil.YearList;
  monthList = CommonUtil.MonthList;
  selectedYear = this.yearList[0].key;
  selectedMonth = new Date().getMonth() + 1;
  ngOnInit() {
    this.GetAllPanelRequestCount();
  }

  GetAllPanelRequestCount() {
    this.loading = true;
    this.requestService.GetAllPanelRequestCountWithStatus(this.selectedYear, this.selectedMonth).subscribe(res => {
      this.loading = false;
      this.RequestData = res;
      this.requeststatus = adminConfig.RequestStatus;
    }, err => {
      alert(err)
    })
  }

  LoadData() {
    this.GetAllPanelRequestCount();
  }

}
