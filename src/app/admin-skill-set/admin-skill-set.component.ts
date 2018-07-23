import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { SkillSetsService } from '../_services/index';
import { SkillSets } from '../_models';

// import { PaginationModule  } from 'ngx-pagination-bootstrap';
import * as $ from 'jquery';

import 'datatables.net';
import 'datatables.net-bs4';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-admin-skill-set',
  templateUrl: './admin-skill-set.component.html',
  styleUrls: ['./admin-skill-set.component.css']
})
export class AdminSkillSetComponent implements OnInit {

  model: any = {};
  skillSets: any;
  skillTypeList: { "Id": string; "Name": string; }[];
  @Input() currentRequestData: any;
  @Input() CurrentUser: any;

  clients: any[];
  dataTable: any;


  constructor(private skillSetsService: SkillSetsService, private http: HttpClient, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentRequestData["CurrentUser"] = this.CurrentUser;
    this.skillSetsService.getAllSkillSets().subscribe(
      devSkills => {
        this.skillSets = (devSkills as SkillSets[]);

        // You'll have to wait that changeDetection occurs and projects data into 
        // the HTML template, you can ask Angular to that for you ;-)
        this.chRef.detectChanges();

        // Now you can use jQuery DataTables :
        const table: any = $('table');
        this.dataTable = table.DataTable();
        //console.log(this.skillSets);
        // .map(x=>({id:x["_id"],itemName:x["skillName"]}));
        // this.skillList=this.skillList.sort((x, y) => x.itemName.localeCompare(y.itemName));
      }
    )
    this.skillTypeList = [
      {
        "Id": 'Dev',
        "Name": "Dev"
      },
      {
        "Id": 'QA',
        "Name": "QA"
      }]
    $(function () {
      //
      // var paginationLinks = $('.pagination a');
      // for (var index = 0; index < paginationLinks.length; index++) {
      //    paginationLinks[index].href="admin#"
      // }
    });
  }
  Showeditview() {
    $(function () {
      $("#editEmployeeModal").show();
    });
  }
  Showeditview1() {
    $(function () {
      $(".edit").click(function (event) {
        $("#editEmployeeModal").show();
      })
    });
  }


  addNewSkill(newSkillName) {
    debugger;
    this.skillSetsService.postNewSkillSet(newSkillName).subscribe(
      result => {
        debugger;
        console.log(result);
      }
    )

  }
  toggleTitle() {
    debugger;
    $('.table-title').slideToggle(); //
  }



}
