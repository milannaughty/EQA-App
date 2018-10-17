import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UserService, EmailService } from '../_services/index';
import { DatePipe } from '@angular/common';
import { appConfig, adminConfig } from '../app.config';
import { CommonUtil } from '../app.util';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  AdminActiveTab: any;
  @Output() messageEvent = new EventEmitter<any>();
  @Input() currentRequestData: any;
  model: any = {};
  loading = false;
  constructor(private userService: UserService,
    private datePipe: DatePipe,
    private emailService: EmailService) { }

  ngOnInit() {
  }
  savefeedback() {
    this.loading = true;
    this.model.AddedBy = this.currentRequestData.currentUser.username;
    this.model.AddedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    this.userService.submitfeedback(this.model).subscribe(
      data => {

      },
      error => {
        console.log("Error while submiting feedback with " + this.model.username);
        CommonUtil.ShowErrorAlert("Error while submiting feedback" + error.error);
        this.loading = false;
      });
  }

}
