import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { COAInterface, MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOfAccountTableComponent } from './chart-of-account-table/chart-of-account-table.component';

@Component({
  selector: 'aims-pos-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.scss']
})
export class ChartOfAccountComponent implements OnInit {

  @ViewChild(ChartOfAccountTableComponent) coaTable: any;
  
  pageFields: COAInterface = {
    coaID: '0',
    userID: '',
    coaTitle: '',
    coaTypeID: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.coaID,
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
      value: this.pageFields.coaTitle,
      msg: 'enter chart of account title',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.coaTypeID,
      msg: 'select chart of account type',
      type: 'selectbox',
      required: true,
    },
  ];
  
  coaTypeList: any = [];
  error: any;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.getCOAType();
  }

  getCOAType() {
    this.dataService.getHttp('fmis-api/ChartOfAccount/getCOAType', '').subscribe(
      (response: any) => {
        this.coaTypeList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {
    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'fmis-api/ChartOfAccount/saveCOA'
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

          this.coaTable.getCOA();
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
  }

  edit(item: any){
    this.formFields[0].value = item.coaID;
    this.formFields[2].value = item.coaTitle;
    this.formFields[3].value = item.coaTypeID;
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
