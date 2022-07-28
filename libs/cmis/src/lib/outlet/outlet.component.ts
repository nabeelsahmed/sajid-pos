import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, OutletInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OutletTableComponent } from './outlet-table/outlet-table.component';

@Component({
  selector: 'aims-pos-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit {

  @ViewChild(OutletTableComponent) productTable: any;

  pageFields: OutletInterface = {
    outletID: '0',
    userID: '',
    outletName: '',
    outletShortName: '',
    outletAddress: '',
    contactPerson: '',
    email: '',
    phoneNo: '',
    mobileNo: '',
  };
  
  formFields: MyFormField[] = [
    {
      value: this.pageFields.outletID,
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
      value: this.pageFields.outletName,
      msg: 'enter outlet name',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.outletShortName,
      msg: 'enter outlet short name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.outletAddress,
      msg: 'enter outlet address',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.contactPerson,
      msg: 'enter contact person',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.email,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.phoneNo,
      msg: 'enter phone',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.mobileNo,
      msg: 'enter mobile no',
      type: 'textBox',
      required: true,
    },
  ];

  
  phoneMask = this.globalService.phoneMask();
  mobileMask = this.globalService.mobileMask();

  tabIndex = 0;
  error: any;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = 1;
  }

  save() {
    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'cmis-api/Outlet/saveOutlet'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){

          this.valid.apiInfoResponse('Record saved successfully');

          this.productTable.getOutlet();
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
    this.formFields[6].value = '';
    this.formFields[7].value = '';

  }
  
  edit(item: any){
    console.log(item);

    this.tabIndex = 0;

    this.formFields[0].value = item.outletID;
    this.formFields[2].value = item.outletName;
    
    this.formFields[3].value = item.outletShortName;
    this.formFields[4].value = item.outletAddress;
    
    this.formFields[5].value = item.contactPerson;
    this.formFields[6].value = item.email;

    this.formFields[7].value = item.phoneNo;
    this.formFields[8].value = item.mobileNo;

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
