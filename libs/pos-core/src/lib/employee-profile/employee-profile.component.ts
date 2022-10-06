import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { EmployeeInterface, MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeProfileTableComponent } from './employee-profile-table/employee-profile-table.component';

@Component({
  selector: 'aims-pos-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {

  @ViewChild(EmployeeProfileTableComponent) employeeTable: any;
  
  pageFields: EmployeeInterface = {
    partyID: '0',
    userID: '',
    partyName: '',
    partyNameUrdu: '',
    cnic: '',
    designationID: '',
    outletID: '',
    type: '',
    cityID: '',
    address: '',
    addressUrdu: '',
    mobile: '',
    description: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.partyID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.partyName,
      msg: 'enter employee name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.partyNameUrdu,
      msg: 'enter employee name urdu',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.cnic,
      msg: 'enter cnic',
      type: 'cnic',
      required: true,
    },
    {
      value: this.pageFields.designationID,
      msg: 'select designation',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.outletID,
      msg: 'select outlet',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.type,
      msg: 'enter type',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.cityID,
      msg: 'select city',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.address,
      msg: 'enter address',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.addressUrdu,
      msg: 'enter address urdu',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.mobile,
      msg: 'enter mobile',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.description,
      msg: 'enter remarks',
      type: 'textbox',
      required: false,
    },
  ];
  
  cityList: any = [];
  designationList: any = [];
  outletList: any = [];

  tabIndex = 0;
  error: any;

  cnicMask = this.globalService.cnicMask();
  mobileMask = this.globalService.mobileMask();

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.getDesignation();
    this.getOutlet();
    this.getCity();
  }

  getDesignation(){
    this.dataService.getHttp('core-api/Designation/getDesignation', '').subscribe(
      (response: any) => {
        this.designationList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getOutlet(){
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe(
      (response: any) => {
        this.outletList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCity(){
    this.dataService.getHttp('core-api/City/getCity', '').subscribe(
      (response: any) => {
        this.cityList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {

    var strCnic = this.formFields[4].value.replace(/_/g, '')
    if(strCnic.length < 15){
      this.valid.apiInfoResponse('enter correct cnic');return;
    }

    var strMobile = this.formFields[11].value.replace(/_/g, '')
    if(strMobile.length < 12){
      this.valid.apiInfoResponse('enter correct mobile no');return;
    }

    this.formFields[7].value = 'Employee'
    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'core-api/Employee/saveEmployee'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){
          if(this.formFields[0].value == '0'){
            this.valid.apiInfoResponse('Record saved successfully');
          }else{
            this.valid.apiInfoResponse('Record updated successfully');
          }

          this.employeeTable.getEmployee();
          this.reset();
        }else{
          this.valid.apiErrorResponse(response.message.toString());
        }
      },
      (error: any) => {
        this.error = error;
        this.valid.apiErrorResponse(this.error);
      }
    );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    
    this.formFields[0].value = '0';
    this.formFields[3].value = '';
    this.formFields[10].value = '';
    this.formFields[12].value = '';
  }

  edit(item: any){
    this.tabIndex = 0;

    console.log(item)
    this.formFields[0].value = item.partyID;
    this.formFields[2].value = item.partyName;
    this.formFields[3].value = item.partyNameUrdu;
    this.formFields[4].value = item.cnic;
    this.formFields[5].value = item.designationID;
    this.formFields[6].value = item.outletid;
    this.formFields[7].value = item.type;
    this.formFields[8].value = item.cityID;
    this.formFields[9].value = item.address;
    this.formFields[10].value = item.addressUrdu;
    this.formFields[11].value = item.mobile;
    this.formFields[12].value = item.description;
  }

  changeTabHeader(tabNum: any) {
    this.tabIndex = tabNum;
  }

  getKeyPressed(e: any){
    if(e.keyCode == 13){
      this.save();
    }
  }

  delete(item: any){
    this.reset();
  }
}
