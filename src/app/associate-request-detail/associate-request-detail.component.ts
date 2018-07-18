import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";

@Component({
  selector: 'app-associate-request-detail',
  templateUrl: './associate-request-detail.component.html',
  styleUrls: ['./associate-request-detail.component.css']
})
export class AssociateRequestDetailComponent implements OnInit {
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  isSkillLoaded: boolean = false;
  reasonText: string = '';
  statusList: any=[];
  ddlId: number;

  constructor(private userService: UserService, private requestService: RequestService) {

  }

  ngOnInit() {

    this.ShowRequestDetails();
    this.populateStatusDropdown();
   // this.reasonText = `${this.currentRequestData.currentUser.FName} ${this.currentRequestData.currentUser.LName} has rejected IQA request on ${Date.now() }`
  }
  
  onStatusChange(event) {
    this.currentRequestData.showRemark = this.model.selectedStatus == "Rejected";
    this.currentRequestData.showSaveButton = this.model.selectedStatus == "Completed" || this.model.selectedStatus == "Rejected" || this.model.selectedStatus == "InProgress";;
  }
  
  ShowRequestDetails() {
    console.log('In Request Detail Method')
    // this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
    //   this.isSkillLoaded = true
    //   var r = result as Object[];
    //   this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
    //   this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));

    // });

  }

  ShowRequestList() {
    this.messageEvent.emit({ ActivateTab: 'HOME' });
  }

  OnSaveClick() {
    var set = {
      "status": this.model.selectedStatus,
      "rejectReason": this.reasonText,
      "requestId": this.currentRequestData._id
    };
    if (this.currentRequestData.panelType == 'Dev')
      set["assignedDevPanelList"] = null;
    if (this.currentRequestData.panelType == 'QA' || this.currentRequestData.panelType == 'Qa')
      set["assignedQAPanelList"] = null;


    this.requestService.updateStatusOfRequest(set).subscribe(result => {
      this.ShowRequestList()
    });
  }

  populateStatusDropdown(){
    if (this.currentRequestData.status == 'PanelAssigned') {
      this.statusList.push({ "Id":"InProgress", "Name": "Accept" })
    }
    else if (this.currentRequestData.status == 'InProgress') {
      this.statusList.push( { "Id": "Completed", "Name": "Complete" })
    }
    this.statusList.push({ "Id": "Rejected", "Name": "Rejected" })
    this.model.selectedStatus = this.statusList[0].Name;
  }

}
