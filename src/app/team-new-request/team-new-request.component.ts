import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, RequestService } from '../_services/index';

@Component({
  selector: 'app-team-new-request',
  templateUrl: './team-new-request.component.html',
  styleUrls: ['./team-new-request.component.css']
})
export class TeamNewRequestComponent implements OnInit {
  loading = false;
  model: any = {};
  ActiveTabs: any = 'InitiateEQARequest';
  @Output() messageEvent = new EventEmitter<any>();
  selectedSkills: number[];
  dropdownSettings = {};
  skillList: any;
  qaSkillList:any;
  public deliveryDate: any = { date: new Date() };
  public expectedIQADate: any = { date: new Date() };
  constructor(
    private router: Router,
    private requestService: RequestService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.skillList = [
      { id: 1, itemName: 'Java' },
      { id: 2, itemName: 'Ruby' },
      { id: 3, itemName: 'PHP' },
      { id: 4, itemName: 'Python' },
      { id: 5, itemName: 'SQL' },
      { id: 6, itemName: 'ASP.NET' },
      { id: 7, itemName: 'ASP.NET MVC' },
      { id: 8, itemName: 'Web API' },
      { id: 9, itemName: 'SQL Server' },
      { id: 10, itemName: 'ASP.NET MVC' },
      { id: 11, itemName: 'AWS' },
      { id: 12, itemName: 'Node.js' },
      { id: 13, itemName: 'Ruby on Rails' },
      { id: 14, itemName: 'C' },
      { id: 15, itemName: 'C++' },
      { id: 16, itemName: 'C#' },
    ].sort((x, y) => x.itemName.localeCompare(y.itemName));
    this.qaSkillList = [
      { id: 17, itemName: 'Web Service' },
            { id: 18, itemName: 'API' },
            { id: 19, itemName: 'Performance' },
            { id: 20, itemName: 'Load ' },
            { id: 21, itemName: 'SQL' },
            { id: 22, itemName: 'Automation' },
            { id: 23, itemName: 'Selenium' },
            { id: 24, itemName: 'UFT' },
            { id: 25, itemName: 'Mobile testing' },
            { id: 26, itemName: 'Jmeter' },
            { id: 27, itemName: 'SOAPUI and Postman' }
    ].sort((x, y) => x.itemName.localeCompare(y.itemName));
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Skillset",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true
    };
  }

  createRequest() {
    this.loading = true;
    this.model.isPanel = this.model.roleId == 2;//2 is used for Panel registration, 1 is for Team
    debugger;
    var currentUser = localStorage.getItem('currentUser');
    debugger;
    var cUser=JSON.parse(currentUser);
    this.model.initiatedBy = {ID:JSON.parse(currentUser)._id,TeamName:JSON.parse(currentUser).teamName}
    this.requestService.create(this.model)
      .subscribe(
      data => {
        this.alertService.success('Registration successful', true);
        this.messageEvent.emit({ ActiveTabChildParam: 'Request History' });

      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

}
