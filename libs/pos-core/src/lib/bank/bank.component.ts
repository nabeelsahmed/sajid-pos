import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { BankInterface, MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BankTableComponent } from './bank-table/bank-table.component';

@Component({
  selector: 'aims-pos-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  @ViewChild(BankTableComponent) bankTable: any;
  
  chkDesposit: any = false;
  chkWithdraw: any = false;

  pageFields: BankInterface = {
    bankID: '0',
    userID: '',
    type: '',
    branchCode: '',
    branchName: '',
    bankName: '',
    accountNo: '',
    accountTitle: '',
    amount: '',
    branchAddress: '',
    description: '',
    coaID: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.bankID,
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
      value: this.pageFields.type,
      msg: 'select Type',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.branchCode,
      msg: 'enter branch code',
      type: 'number',
      required: true,
    },
    {
      value: this.pageFields.branchName,
      msg: 'enter branch name',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.bankName,
      msg: 'enter bank name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.accountNo,
      msg: 'enter account no',
      type: 'number',
      required: true,
    },
    {
      value: this.pageFields.accountTitle,
      msg: 'enter account title',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.amount,
      msg: 'enter opening balance',
      type: 'number',
      required: true,
    },
    {
      value: this.pageFields.branchAddress,
      msg: 'enter branch address',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.description,
      msg: 'enter description',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.coaID,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ];
  
  tabIndex = 0;
  error: any;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();
  }

  save() {
    if(this.chkDesposit == true && this.chkWithdraw == false){
      this.formFields[2].value = 'deposit'
    }else if(this.chkDesposit == false && this.chkWithdraw == true){
      this.formFields[2].value = 'withdraw'
    }else if(this.chkDesposit == true && this.chkWithdraw == true){
      this.formFields[2].value = 'both'
    }

    if(this.formFields[0].value == '0'){
      this.formFields[11].value = '0';
    }
    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'core-api/Bank/saveBank'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){
          if(this.formFields[0].value == '0'){
            this.valid.apiInfoResponse('record saved successfully');
          }else{
            this.valid.apiInfoResponse('record updated successfully');
          }

          this.bankTable.getBank();
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
    this.formFields[10].value = '';
    this.chkDesposit = false;
    this.chkWithdraw = false;
  }

  edit(item: any){
    this.tabIndex = 0;
    
    this.formFields[0].value = item.bankID;
    this.formFields[2].value = item.type;
    
    if(this.formFields[2].value == 'deposit'){
      this.chkDesposit = true;
    }else if(this.formFields[2].value == 'withdraw'){
      this.chkWithdraw = true;
    }else if(this.formFields[2].value == 'both'){
      this.chkDesposit = true;
      this.chkWithdraw = true;
    }

    this.formFields[3].value = item.branchCode;
    this.formFields[4].value = item.branchname;
    this.formFields[5].value = item.bankName;
    this.formFields[6].value = item.accountNo;
    this.formFields[7].value = item.accountTitle;
    this.formFields[8].value = item.amount;
    this.formFields[9].value = item.branchAddress;
    this.formFields[10].value = item.description;
    this.formFields[11].value = item.coaID;
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
