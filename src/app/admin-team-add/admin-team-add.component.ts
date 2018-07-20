import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AlertService, UserService } from '../_services/index';
import { SkillSets } from '../_models/SkillSets';
import { DatePipe } from '@angular/common';
import { NospacePipe } from '../nospace.pipe';

@Component({
  selector: 'app-admin-team-add',
  templateUrl: './admin-team-add.component.html',
  styleUrls: ['./admin-team-add.component.css']
})
export class AdminTeamAddComponent implements OnInit {
  @Input() currentRequestData: any;
  model: any = {};
  loading = false;
  areaList: any;
  constructor(private userService: UserService, private datePipe: DatePipe, private alertService: AlertService) { }

  ngOnInit() {
    this.areaList = [{ 'Id': 'EBS', 'Name': 'EBS' }, { 'Id': 'DMG', 'Name': 'DMG' }];
    this.model.area = this.areaList[0].Name;
  }


  register() {
    this.loading = true;
    this.model.isPanel = false;
    this.model.AddedBy = { AdminUser: this.currentRequestData.currentUser.username };
    this.model.AddedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    //TODO : Autogenerate Password
    this.model.password = 'nihilent@123';
    this.model.username = new NospacePipe().transform(this.model.teamName.toLowerCase());
    this.userService.create(this.model).subscribe(
      data => {
        this.alertService.success('Registration successful', true);
        //this.clear();
        this.loading = false;
      },
      error => {
        this.alertService.error(error.error);
        this.loading = false;
      });
  }

}
