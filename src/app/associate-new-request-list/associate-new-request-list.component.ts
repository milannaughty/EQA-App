import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'associate-new-request-list',
  templateUrl: './associate-new-request-list.component.html',
  styleUrls: ['./associate-new-request-list.component.css']
})
export class AssociateNewRequestListComponent implements OnInit {
  NewRequest: any[];

  constructor() { }

  ngOnInit() {
    this.loadNewRequestForAssociate();
  }

  private loadNewRequestForAssociate() {
    //this.userService.getAll().subscribe(users => { this.users = users; });
    this.NewRequest = [{
      ID: 1,
      PBIID: 100,
      Name: 'Payu PSP Team',
      Skills: 'AWS,NodeJs',
      DeliveryDate: new Date().toLocaleDateString(),
      ExpectedIQADate: new Date().toLocaleDateString(),
      Status: 'New',
      UserIDs: '',
      CheckList: '',
      Remarks: '',
      InitiatedBy: 'Ravi',
      CreationDate: new Date().toLocaleDateString(),
      UpdateDate: new Date().toLocaleDateString()
    }, {
      ID: 2,
      PBIID: 100,
      Name: 'Payu PSP Team',
      Skills: 'AWS,NodeJs',
      DeliveryDate: new Date().toLocaleDateString(),
      ExpectedIQADate: new Date().toLocaleDateString(),
      Status: 'New',
      UserIDs: '',
      CheckList: '',
      Remarks: '',
      InitiatedBy: 'Ravi',
      CreationDate: new Date().toLocaleDateString(),
      UpdateDate: new Date().toLocaleDateString()
    }, {
      ID: 3,
      PBIID: 100,
      Name: 'Payu PSP Team',
      Skills: 'AWS,NodeJs',
      DeliveryDate: new Date().toLocaleDateString(),
      ExpectedIQADate: new Date().toLocaleDateString(),
      Status: 'New',
      UserIDs: '',
      CheckList: '',
      Remarks: '',
      InitiatedBy: 'Ravi',
      CreationDate: new Date().toLocaleDateString(),
      UpdateDate: new Date().toLocaleDateString()
    }, {
      ID: 4,
      PBIID: 100,
      Name: 'Payu PSP Team',
      Skills: 'AWS,NodeJs',
      DeliveryDate: new Date().toLocaleDateString(),
      ExpectedIQADate: new Date().toLocaleDateString(),
      Status: 'New',
      UserIDs: '',
      CheckList: '',
      Remarks: '',
      InitiatedBy: 'Ravi',
      CreationDate: new Date().toLocaleDateString(),
      UpdateDate: new Date().toLocaleDateString()
    }, {
      ID: 5,
      PBIID: 100,
      Name: 'Payu PSP Team',
      Skills: 'AWS,NodeJs',
      DeliveryDate: new Date().toLocaleDateString(),
      ExpectedIQADate: new Date().toLocaleDateString(),
      Status: 'New',
      UserIDs: '',
      CheckList: '',
      Remarks: '',
      InitiatedBy: 'Ravi',
      CreationDate: new Date().toLocaleDateString(),
      UpdateDate: new Date().toLocaleDateString()
    }, {
      ID: 6,
      PBIID: 100,
      Name: 'Payu PSP Team',
      Skills: 'AWS,NodeJs',
      DeliveryDate: new Date().toLocaleDateString(),
      ExpectedIQADate: new Date().toLocaleDateString(),
      Status: 'New',
      UserIDs: '',
      CheckList: '',
      Remarks: '',
      InitiatedBy: 'Ravi',
      CreationDate: new Date().toLocaleDateString(),
      UpdateDate: new Date().toLocaleDateString()
    }]
  }

}
