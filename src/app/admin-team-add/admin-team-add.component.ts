import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-team-add',
  templateUrl: './admin-team-add.component.html',
  styleUrls: ['./admin-team-add.component.css']
})
export class AdminTeamAddComponent implements OnInit {
  @Input() currentRequestData: any;
  constructor() { }

  ngOnInit() {
  }

}
