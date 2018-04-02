import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-new-request',
  templateUrl: './team-new-request.component.html',
  styleUrls: ['./team-new-request.component.css']
})
export class TeamNewRequestComponent implements OnInit {

  model: any = {};
  selectedSkills: number[];
  dropdownSettings = {};
  skillList: any;
  public deliveryDate: any = { date: new Date() };
  public expectedIQADate: any = { date: new Date() };
  constructor() { }

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
  this.dropdownSettings = {
      singleSelection: false,
      text: "Select Skillset",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true
  };
  }

}
