import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { UserService, AreaServices, AlertService } from '../_services';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Area } from '../_models/Area';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-admin-area-add',
  templateUrl: './admin-area-add.component.html',
  styleUrls: ['./admin-area-add.component.css']
})
export class AdminAreaAddComponent implements OnInit {
    model:any = {}; 
    area1:any;
    rowIndex: number;
    deleteIndex: number;
    undateIndex: number;
    @Input() currentRequestData:any;
    @Input() CurrentUser:any;
    dropdownSettings = {};
    loading = false;
    tblloading = false;
    saveButtonCaption: string = 'Add Area';
    areaMassage: any;
    isError: boolean;
    isAddArea: true;
    showMessage: boolean;
    areaName:any;
    description:any;
    createdBy:any;
    createdOn:any;
    dataTable: any;
    tempVerificationBeforeUpdate: any;
  swaConfirmConfig: any = {
    title: 'Are you sure?',
    text: "You want to delete this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }
  

  constructor(private AreaServices: AreaServices, private http: HttpClient,
  private chRef: ChangeDetectorRef, private userService: UserService,
  private alertService: AlertService, private datePipe: DatePipe) { }
  

  ngOnInit() {
    debugger;
    this.currentRequestData["CurrentUser"] = this.CurrentUser;
    this.getAllAreaOnLoad();
  }


  addArea(){
    debugger;
    console.log("start of Add area method");
   
    this.model.modifiedBy = this.currentRequestData.currentUser.username;
    this.model.modifiedOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
    this.model.isDeleted = false;
    this.model.status = 'ACTIVE';
    
    if(this.saveButtonCaption=="Add Area")
    {
      debugger;
      this.model.createdBy = this.currentRequestData.currentUser.username;
      this.model.createdOn = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS');
     this.loading=true;
     this.AreaServices.postNewArea(this.model).subscribe(
      result=>
      {
        this.saveButtonCaption=='Add Area';
        console.log(result);
        this.isError=false;
        this.areaMassage="Area added Succesfully";
        this.showSuccessAlert(this.areaMassage);
        this.loading=false;
        let tdata = this.dataTable;
        let DataRows = this.dataTable.data().length - 1;
        let getKLastRow = tdata.data()[DataRows];
        let rowNo = parseInt(getKLastRow[0])+1;
        this.dataTable.row.add( [
          rowNo,
          this.model.areaName,
          this.model.Description,
          this.model.createdBy,
          this.model.createdOn,
          `<a (click)="editArea(client, i)" class="edit"><i class="glyphicon glyphicon-edit" title="Edit"></i></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a (click)="deleteArea(client, i)" class="delete"><i class="glyphicon glyphicon-remove"
                  title="Delete"></i></a>`
      ] ).draw( false );
      this.clear();
    },
      error=>{
        this.isError = true;
        this.areaMassage = error.message;
        this.ErrorAlert(this.areaMassage);
        this.loading = false;
      });
  }else if (this.saveButtonCaption == 'Update Changes') {
    debugger;
    var descriptionShouldBeUpdated;
    this.loading = true;
    
    if(this.tempVerificationBeforeUpdate.areaName==this.model.areaName
      && this.tempVerificationBeforeUpdate.Description==this.model.Description)
      {
      console.log("No Changes"); 
      this.isError = true;
      this.areaMassage = "Kindly make any changes before clicking update button";
      this.ErrorAlert(this.areaMassage);
      this.loading = false;
      }else{
        var set = {
          "areaName":this.model.areaName,
          "Description":this.model.Description,
          "requestId": this.model._id,
          "modifiedBy": this.currentRequestData.currentUser.username,
          "modifiedOn": this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:MM:SS'),
          "descriptionFlag":this.tempVerificationBeforeUpdate.areaName==this.model.areaName
          && this.tempVerificationBeforeUpdate.Description!=this.model.Description?true:false,
          "areaFlag":this.tempVerificationBeforeUpdate.areaName!=this.model.areaName
          && this.tempVerificationBeforeUpdate.Description==this.model.Description?true:false,
        };
        this.AreaServices.updateAreaToDb(set).subscribe(
          result => {
            console.log(result);
            this.areaMassage="";
            this.isError = false;
            this.areaMassage = "Area updated successfully.";
            this.loading = false;
            this.ShowSuccessAlert(this.areaMassage);
            var temp = this.dataTable.row(this.rowIndex).data();
            temp[1] = this.model.areaName;
            temp[2] = this.model.Description;
            temp[3] = this.model.createdBy;
            temp[4] = this.model.createdOn;
            this.dataTable.row(this.rowIndex).data(temp);//.draw();
          
            this.clear();
            this.saveButtonCaption = 'Add Area';
          },
          error => {
            this.isError = true;
            this.areaMassage = error.error;
            this.ErrorAlert(this.areaMassage);
            this.loading = false;
          });
      }

   
  }

  }

  showSuccessAlert(msg) 
  {
    swal('success',msg,'success');
  }

  getAllAreaOnLoad()
  {
    debugger;
    this.tblloading = true;
    this.AreaServices.getAllArea().subscribe(
      devArea => 
      {
        this.area1 = (devArea as Area[]);
        debugger;
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable();
        this.tblloading = false;
      })
  }

  areaClear()
  {
    this.clear();
  }
  clear() {
    this.model.areaName = '';
    this.model.Description='';
    this.saveButtonCaption = 'Add Area';
  }

  editArea(data, i) {
    this.tempVerificationBeforeUpdate=data;
    this.findIndex(data);
    this.undateIndex = i;
    console.log('Redirecting from request list to request detail view');
    this.model.areaName = data.areaName;
    this.model.Description = data.Description;
    this.model._id = data._id;
    this.saveButtonCaption = 'Update Changes';
  }
  findIndex(data) {
    var dd = this.dataTable, CurData = data.areaName, a = [];
    for (let i = 0; i < dd.data().length; i++) {
      a.push(dd.data()[i]);
    }
    var p = 0, m;
    a.map(function (e) {
      p++;
      if (e.indexOf(CurData) > 0) {
        m = p;
      }
    })
    this.rowIndex = m - 1;
  }


  deleteArea(data, i) {
    this.findIndex(data);
    this.deleteIndex = i;
    this.loading = true;
    this.ShowDeleteConfirmation(data);
    this.loading = false;
  }
  ShowDeleteConfirmation(data) {
    swal(this.swaConfirmConfig).then((result) =>
     {
      if (result.value) {
        this.PerformDeleteOperation(data);
      }
    })
  }
  PerformDeleteOperation(data) {
    var set = {
      "requestId": data._id
    };
    
    this.AreaServices.deleteArea(data._id).subscribe(
      result => {
        console.log(result);
        this.isError = false;
        this.areaMassage = "Area deleted successfully.";
        this.ShowSuccessAlert(this.areaMassage);
        //this.skillSets.splice(this.deleteIndex, 1);
        this.dataTable.row(this.rowIndex).remove().draw();
      },
      error => {
        this.isError = true;
        this.areaMassage = error.error;
        this.ErrorAlert(this.areaMassage);
      });
  }

  ErrorAlert(error) {
    swal({
      type: 'error',
      title: error,
    })
  }
  ShowSuccessAlert(msg) {
    swal('success', msg, 'success')
  }
}
  