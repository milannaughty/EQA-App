import { Component, OnInit } from '@angular/core';
import { RequestService } from '../_services/request.service';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.css']
})
export class AdminHomePageComponent implements OnInit {
  loading: boolean;

  id = 'chart1';
  width = 600;
  height = 400;
  type = 'column2d';
  dataFormat = 'json';
  dataSource;
  title = 'Angular4 FusionCharts Sample';


  constructor(private requestService: RequestService) {

  }

  ngOnInit() { this.LoadRequestSummary(); }

  private LoadRequestSummary() {
    this.loading = true;
    this.requestService.getAll().subscribe(result => {
      this.loading = false;
      var counts = result.reduce((p, c) => {
        var name = c.status;
        if (!p.hasOwnProperty(name)) {
          p[name] = 0;
        }
        p[name]++;
        return p;
      }, {});
      var summaryData = Object.keys(counts).map(k => {
        return { label: k, value: counts[k] };
      });

      this.dataSource = {
        "chart": {
          "caption": "IQA Request Summary",
          "subCaption": "",
          "numberprefix": "",
          "theme": "fint"
        },
        "data": summaryData
      }
    });
  }
}


